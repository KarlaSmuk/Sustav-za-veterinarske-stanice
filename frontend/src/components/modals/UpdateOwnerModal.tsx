import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { type MouseEvent, useEffect, useState } from "react";
import validator from "validator";
import type { UpdateUserDto } from "@/api/types/api.requests.types";
import { updateUser } from "@/api/user.service";
import type { User } from "@/api/types/api.types";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  updateOwner: (user: User) => void;
}

export default function UpdateUserModal({
  isOpen,
  onClose,
  userId,
  updateOwner,
}: CreateUserModalProps) {
  const [user, setUser] = useState<UpdateUserDto>({
    id: userId,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(true);

  const toast = useToast();

  useEffect(() => {
    setUser((prevUser) => ({
      ...prevUser,
      id: userId,
    }));
  }, [userId]);

  useEffect(() => {
    setButtonDisabled(
      !(user.firstName || user.lastName || user.email || user.phone)
    );
  }, [user]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function stripEmpty<T extends Record<string, any>>(obj: T): Partial<T> {
    return Object.fromEntries(
      Object.entries(obj).filter(
        ([, v]) => v !== "" && v !== undefined && v !== null
      )
    ) as Partial<T>;
  }

  const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      if (!validator.isEmail(user.email!) && user.email) {
        toast({
          title: "Pogrešan format Email-a",
          status: "error",
        });
        return;
      }
      const payload = stripEmpty(user) as UpdateUserDto;

      const response = await updateUser(payload);

      if (response.success) {
        updateOwner(response.message);
        onClose();
      }
    } catch {
      console.log(
        "Failed to update user. Please check your input and try again."
      );
      toast({
        title: "Nesupješno uređivanje podataka vlasnika",
        status: "error",
      });
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Uredi podatke vlasnika</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Ime</FormLabel>
              <Input
                placeholder="Ime"
                name="firstName"
                value={user?.firstName}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Prezime</FormLabel>
              <Input
                placeholder="Prezime"
                name="lastName"
                value={user?.lastName}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Email</FormLabel>
              <Input
                placeholder="Email"
                type="email"
                name="email"
                value={user?.email}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Broj mobitela</FormLabel>
              <Input
                placeholder="Broj mobitela"
                name="phone"
                value={user?.phone}
                onChange={(e) => handleInputChange(e)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button type="button" colorScheme="red" mr={3} onClick={onClose}>
              Odustani
            </Button>
            <Button
              isDisabled={buttonDisabled}
              colorScheme="green"
              mr={3}
              onClick={handleSubmit}
            >
              Potvrdi
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
