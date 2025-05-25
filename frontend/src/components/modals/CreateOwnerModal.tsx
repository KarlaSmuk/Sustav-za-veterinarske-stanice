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
import type { CreateUserDto } from "../../api/types/api.requests.types";
import type { Owner } from "../../api/types/api.types";
import { createUser } from "@/api/user.service";
import { UserRole } from "@/enums/roles.enum";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  addNewOwner: (owner: Owner) => void;
}

export default function CreateUserModal({
  isOpen,
  onClose,
  addNewOwner,
}: CreateUserModalProps) {
  const [user, setUser] = useState<CreateUserDto>({
    firstName: "",
    lastName: "",
    email: "",
    role: UserRole.OWNER,
    phone: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(true);

  const toast = useToast();

  useEffect(() => {
    setButtonDisabled(
      !(user.firstName && user.lastName && user.email && user.phone)
    );
  }, [user]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      if (!validator.isEmail(user.email)) {
        toast({
          title: "Pogrešan format Email-a",
          status: "error",
        });
        return;
      }

      const response = await createUser(user);
      if (response.success) {
        addNewOwner(response.message);
        onClose();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response.data.message.includes("duplicate key")) {
        toast({
          title: "Neuspješno dodavanje novog vlasnika",
          description: "Email se već koristi",
          status: "error",
        });
      } else {
        toast({
          title: "Neuspješno dodavanje novog vlasnika.",
          description: "Pokušajte ponovno",
          status: "error",
        });
      }
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Dodaj novog vlasnika</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Ime</FormLabel>
              <Input
                placeholder="Ime"
                name="firstName"
                value={user?.firstName}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mt={4} isRequired>
              <FormLabel>Prezime</FormLabel>
              <Input
                placeholder="Prezime"
                name="lastName"
                value={user?.lastName}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mt={4} isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                placeholder="Email"
                type="email"
                name="email"
                value={user?.email}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mt={4} isRequired>
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
