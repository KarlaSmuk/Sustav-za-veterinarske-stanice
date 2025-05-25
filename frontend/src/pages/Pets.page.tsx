import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Heading,
  IconButton,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { type MouseEvent, useEffect, useState } from "react";
import { AddIcon, CheckIcon, DeleteIcon } from "@chakra-ui/icons";
import type { Pet } from "@/api/types/api.types";
import {
  deletePetById,
  getPetsByOwnerId,
  updatePetNeutered,
} from "@/api/pets.service";
import CreatePetModal from "@/components/modals/CreatePetModal";

export default function Pets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const params = useParams();

  const toast = useToast();

  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();

  useEffect(() => {
    fetchPetsForOwner();
  }, []);

  const fetchPetsForOwner = async () => {
    try {
      const response = await getPetsByOwnerId(params.ownerId!);
      console.log(response);
      setPets(response);
    } catch (error) {
      console.error("Error fetching pets:", error);
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    const now = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = now.getFullYear() - birthDate.getFullYear();
    const monthDiff = now.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && now.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const addNewPet = (pet: Pet) => {
    setPets((prev) => [...prev, pet]);
  };

  const updatePet = (updatedPet: Pet) => {
    setPets((prev) =>
      prev.map((pet) => (pet.id === updatedPet.id ? updatedPet : pet))
    );
  };

  const deletePet = async (petId: string) => {
    try {
      console.log(petId);
      const response = await deletePetById(petId);
      if (response.success) {
        setPets((prev) => prev.filter((pet) => pet.id !== petId));
        toast({
          title: "Ljubimac uspješno izbrisan!",
          status: "success",
        });
      } else {
        throw new Error("Brisanje nije uspjelo");
      }
    } catch {
      toast({
        title: "Greška prilikom brisanja ljubimca.",
        status: "error",
      });
    }
  };

  const handlePetNeutered = async (
    e: MouseEvent<HTMLButtonElement>,
    petId: string
  ) => {
    e.preventDefault();
    try {
      const response = await updatePetNeutered(petId);
      updatePet(response);
    } catch (error) {
      console.log("Error updating status:", error);
      toast({
        title: "Pogreška kod promjene ljubimca.",
        status: "error",
      });
    }
  };

  return (
    <Flex
      direction={"column"}
      minHeight={"100vh"}
      bgColor={"gray.50"}
      paddingX={"100px"}
      paddingY={"50px"}
    >
      <CreatePetModal
        isOpen={isCreateOpen}
        onClose={onCreateClose}
        ownerId={params.ownerId!}
        addNewPet={addNewPet}
      />
      <Flex justifyContent={"space-between"} alignItems={"end"}>
        <Heading size="lg" className="my-10 ml-5">
          Ljubimci
        </Heading>
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
          Dodaj novog ljubimca
        </Button>
      </Flex>
      <Flex
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-evenly"}
        marginBottom={10}
        wrap={"wrap"}
        gap={5}
      >
        {pets &&
          pets.map((pet) => (
            <Card
              key={pet.id}
              borderWidth="1px"
              borderRadius="10px"
              borderColor={"grey.10"}
              width={"max-content"}
              padding={5}
              marginTop={10}
            >
              <CardHeader>
                <Flex>
                  <Flex
                    flex="1"
                    gap="4"
                    alignItems="center"
                    flexWrap="wrap"
                    justifyContent={"space-between"}
                  >
                    <Flex>
                      {pet.photo && (
                        <Avatar mr={3} size={"lg"} name={`${pet.name}`} />
                      )}

                      <Flex
                        direction={"column"}
                        alignItems={"start"}
                        justifyContent={"center"}
                      >
                        <Heading size="md">{pet.name}</Heading>
                        <Text color={"grey"}>
                          {pet.breed.species.name}, {pet.breed.name}
                        </Text>
                      </Flex>
                    </Flex>
                    <Button
                      onClick={() => deletePet(pet.id)}
                      rightIcon={<DeleteIcon />}
                      width={"100px"}
                      height={"25px"}
                      textColor={"black"}
                      size="sm"
                    >
                      Izbriši
                    </Button>
                  </Flex>
                </Flex>
              </CardHeader>
              <CardBody>
                <Box>
                  <Flex justifyContent={"space-evenly"} wrap={"wrap"}>
                    <Flex
                      direction={"column"}
                      alignItems={"center"}
                      margin={2}
                      bgColor={
                        pet.gender === "Muško"
                          ? "rgb(162, 210, 255)"
                          : "rgb(255, 175, 204)"
                      }
                      padding={2}
                      borderRadius={5}
                      width={"100px"}
                    >
                      <Text fontWeight={"bold"}>Spol</Text>
                      <Text>{pet.gender}</Text>
                    </Flex>
                    <Flex
                      direction={"column"}
                      alignItems={"center"}
                      margin={2}
                      bgColor={"rgb(213, 189, 175)"}
                      padding={2}
                      borderRadius={5}
                      width={"100px"}
                    >
                      <Text fontWeight={"bold"}>Boja</Text>
                      <Text>{pet.color}</Text>
                    </Flex>
                    <Flex
                      direction={"column"}
                      alignItems={"center"}
                      margin={2}
                      bgColor={"rgb(227, 213, 202)"}
                      padding={2}
                      borderRadius={5}
                      width={"100px"}
                    >
                      <Text fontWeight={"bold"}>Godine</Text>
                      <Text>{calculateAge(pet.dob)}</Text>
                    </Flex>
                    <Flex
                      direction={"column"}
                      margin={2}
                      alignItems={"center"}
                      bgColor={"rgb(245, 235, 224)"}
                      padding={2}
                      borderRadius={5}
                      width={"100px"}
                    >
                      <Text fontWeight={"bold"}>
                        {pet.gender === "Muško" ? "Kastriran" : "Sterilizirana"}
                      </Text>
                      <Flex gap={2}>
                        <Text>{pet.neutered ? "Da" : "Ne"}</Text>
                        {!pet.neutered && (
                          <IconButton
                            onClick={(e) => handlePetNeutered(e, pet.id)}
                            aria-label="Promjena"
                            colorScheme="green"
                            size={"xs"}
                            icon={<CheckIcon />}
                            isRound
                          />
                        )}
                      </Flex>
                    </Flex>
                  </Flex>
                </Box>
              </CardBody>
              <Divider />
            </Card>
          ))}
      </Flex>
    </Flex>
  );
}
