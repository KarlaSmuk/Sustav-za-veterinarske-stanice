import {
  Avatar,
  Heading,
  Flex,
  Text,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Button,
  useDisclosure,
  IconButton,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AddIcon,
  ArrowBackIcon,
  ArrowForwardIcon,
  DeleteIcon,
  EditIcon,
} from "@chakra-ui/icons";
import type { Owner, User } from "@/api/types/api.types";
import { getOwners } from "@/api/owner.service";
import { deleteUser } from "@/api/user.service";
import UpdateUserModal from "@/components/modals/UpdateOwnerModal";
import CreateUserModal from "@/components/modals/CreateOwnerModal";

export default function Owners() {
  const [ownersData, setOwnersData] = useState<Owner[]>([]);
  const [ownerListPage, setOwnersListPage] = useState(10);
  const [prevOwnerListPage, setPrevOwnersListPage] = useState(0);

  const [selectedUserId, setSelectedUserId] = useState("");

  const navigate = useNavigate();

  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();

  const {
    isOpen: isUpdateOpen,
    onOpen: onUpdateOpen,
    onClose: onUpdateClose,
  } = useDisclosure();

  useEffect(() => {
    loadOwners();
  }, []);

  const loadOwners = async () => {
    try {
      const data = await getOwners();
      setOwnersData(data);
    } catch (error) {
      console.error("Error geting clinics:", error);
    }
  };

  const addNewOwner = (newOwner: Owner) => {
    setOwnersData((prev) => [...prev, newOwner]);
  };

  const updateOwner = (updatedUser: User) => {
    setOwnersData((prev) =>
      prev.map((owner) =>
        owner.user.id === updatedUser.id
          ? {
              ...owner,
              user: updatedUser,
            }
          : owner
      )
    );
  };

  const handleRowClick = (id: string) => {
    navigate(`/owners/${id}`);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDelete = (id: string) => async (e: any) => {
    e.stopPropagation(); //dont use parent default
    try {
      await deleteUser(id);

      setOwnersData((prev) => {
        const updatedOwners = prev.filter((owner) => owner.user.id !== id);

        if (updatedOwners.length <= 10) {
          setOwnersListPage(10);
          setPrevOwnersListPage(0);
        }

        return updatedOwners;
      });
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <Flex
      direction={"column"}
      height={"100vh"}
      bgColor={"gray.50"}
      paddingX={"100px"}
      paddingY={"50px"}
    >
      <UpdateUserModal
        isOpen={isUpdateOpen}
        onClose={onUpdateClose}
        userId={selectedUserId}
        updateOwner={updateOwner}
      />

      <CreateUserModal
        isOpen={isCreateOpen}
        onClose={onCreateClose}
        addNewOwner={addNewOwner}
      />
      <Flex justifyContent={"space-between"} alignItems={"end"} mb={5}>
        <Flex direction={"column"}>
          <Heading size="lg" className="my-10 ml-5">
            Vlasnici
          </Heading>
        </Flex>
        <Button
          onClick={onCreateOpen}
          leftIcon={<AddIcon />}
          colorScheme="green"
          width={"200px"}
          height={"30px"}
          textColor={"white"}
          mr={10}
          size="sm"
        >
          Dodaj novog vlasnika
        </Button>
      </Flex>
      <Flex bgColor={"gray.50"} direction={"column"}>
        <TableContainer
          bgColor={"white"}
          marginX={2}
          border={"1px"}
          borderRadius={"10px"}
          borderColor={"gray.400"}
        >
          <Table>
            <Thead>
              <Tr>
                <Th></Th>
                <Th>Ime i prezime</Th>
                <Th>Broj mobitela</Th>
                <Th>Email</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {ownersData
                .slice(prevOwnerListPage, ownerListPage)
                .map((owner) => (
                  <Tr
                    key={owner.id}
                    className="cursor-pointer"
                    _hover={{ color: "teal" }}
                    onClick={() => handleRowClick(owner.id)}
                  >
                    <Td verticalAlign={"end"}>
                      <Avatar
                        //src={`https://lh3.googleusercontent.com/d/${owner.user.photo}`}
                        name={`${owner.user.firstName} ${owner.user.lastName}`}
                      />
                    </Td>
                    <Td>
                      {owner.user.firstName} {owner.user.lastName}
                    </Td>
                    <Td>{owner.user.phone}</Td>
                    <Td>{owner.user.email}</Td>
                    <Td>
                      <IconButton
                        icon={<EditIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedUserId(owner.user.id);
                          onUpdateOpen();
                        }}
                        boxSize={6}
                        color={"green"}
                        aria-label={"Update user"}
                        bgColor={"transparent"}
                      />
                      <IconButton
                        icon={<DeleteIcon />}
                        onClick={handleDelete(owner.user.id)}
                        boxSize={6}
                        color={"red"}
                        marginLeft={7}
                        aria-label={"Delete user"}
                        bgColor={"transparent"}
                      />
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Flex>
      <Flex
        flexDirection={"column"}
        alignItems={"end"}
        marginRight={20}
        marginTop={3}
      >
        <Text fontSize="xs" color={"GrayText"} className="">
          Ukupno vlasnika: {ownersData.length}
        </Text>
        {ownersData.length > 10 && (
          <Flex flexDirection={"row"} marginBottom={5}>
            <Button
              onClick={() => {
                if (ownerListPage > 10) {
                  setPrevOwnersListPage(prevOwnerListPage - 10);
                  setOwnersListPage(ownerListPage - 10);
                }
              }}
              className="mt-2"
              bgColor={"gray"}
              color={"white"}
            >
              <ArrowBackIcon />
            </Button>
            <Button
              onClick={() => {
                if (ownerListPage < ownersData.length) {
                  setPrevOwnersListPage(prevOwnerListPage + 10);
                  setOwnersListPage(ownerListPage + 10);
                }
              }}
              className="mt-2 ml-5"
              bgColor={"gray"}
              color={"white"}
            >
              <ArrowForwardIcon />
            </Button>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}
