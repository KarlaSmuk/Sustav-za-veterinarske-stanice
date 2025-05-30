import {
  getSpecies,
  getBreedsBySpeciesId,
  createPet,
} from "@/api/pets.service";
import type { CreatePetDto } from "@/api/types/api.requests.types";
import type { Pet, SpeciesBreed } from "@/api/types/api.types";
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
  HStack,
  Radio,
  RadioGroup,
  Select,
} from "@chakra-ui/react";
import { type ChangeEvent, type MouseEvent, useEffect, useState } from "react";

interface CreatePetModalProps {
  isOpen: boolean;
  onClose: () => void;
  ownerId: string;
  addNewPet: (pet: Pet) => void;
}

export default function CreatePetModal({
  isOpen,
  onClose,
  ownerId,
  addNewPet,
}: CreatePetModalProps) {
  const initialPet = {
    name: "",
    dob: new Date().toISOString().split("T")[0], // "2025-05-25"
    neutered: false,
    gender: "",
    color: "",
    speciesName: "",
    breedName: "",
  };

  const [pet, setPet] = useState<CreatePetDto>(initialPet);

  const [species, setSpecies] = useState<SpeciesBreed[] | undefined>(undefined);
  const [breeds, setBreeds] = useState<SpeciesBreed[] | undefined>(undefined);
  const [speciesId, setSpeciesId] = useState("");

  const [otherSpecies, setOtherSpecies] = useState(false);
  const [otherBreed, setOtherBreed] = useState(false);

  const [buttonDisabled, setButtonDisabled] = useState(true);

  const toast = useToast();

  useEffect(() => {
    loadSpecies();
  }, []);

  const loadSpecies = async () => {
    try {
      const response = await getSpecies();
      setSpecies(response);
    } catch (error) {
      console.error("Error geting clinics:", error);
    }
  };

  const loadBreedsBySpeciesId = async (speciesId: string) => {
    try {
      const response = await getBreedsBySpeciesId(speciesId);
      setBreeds(response);
    } catch (error) {
      console.error("Error geting clinics:", error);
    }
  };

  useEffect(() => {
    setButtonDisabled(
      !(
        pet.name &&
        pet.dob &&
        pet.gender &&
        pet.color &&
        pet.breedName &&
        pet.speciesName
      )
    );
    if (speciesId) loadBreedsBySpeciesId(speciesId);
  }, [pet]);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    if (name == "speciesName" && value == "Other") {
      setOtherSpecies(true);
    } else if (name == "breedName" && value == "Other") {
      setOtherBreed(true);
    }
    if (name == "speciesName" && event.target instanceof HTMLSelectElement) {
      const selectElement = event.target as HTMLSelectElement;
      const id = selectElement.selectedOptions[0]?.getAttribute("id");
      setSpeciesId(id!);
    }
    setPet((prevPet) => ({
      ...prevPet,
      [name]: value,
    }));

  };

  const handleNeuteredChange = (newValue: string) => {
    setPet((prevPet) => ({
      ...prevPet,
      neutered: newValue === "true" ? true : false,
    }));
  };

  const handleGenderChange = (newValue: string) => {
    setPet((prevPet) => ({
      ...prevPet,
      gender: newValue,
    }));
  };

  // const formatDate = (date: Date) => {
  //   const day = String(date.getDate()).padStart(2, "0");
  //   const month = String(date.getMonth() + 1).padStart(2, "0");
  //   const year = date.getFullYear();
  //   return `${year}-${month}-${day}`;
  // };

  const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      const response = await createPet(pet, ownerId);
      if (response) {
        addNewPet(response);
        onClose();
        setPet(initialPet);
      }
    } catch {
      console.error("Error during creating pet.");
      toast({
        title: "Pogreška kod dodavanja novog ljubimca.",
        status: "error",
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Dodaj novog ljubimca</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mt={4} isRequired>
            <FormLabel>Spol</FormLabel>
            <RadioGroup value={pet.gender} onChange={handleGenderChange}>
              <HStack spacing="24px">
                <Radio value={"M"}>Muško</Radio>
                <Radio value={"F"}>Žensko</Radio>
              </HStack>
            </RadioGroup>
          </FormControl>
          <FormControl mt={4} isRequired>
            <FormLabel>Ime</FormLabel>
            <Input
              placeholder="Ime"
              name="name"
              value={pet.name}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl mt={4} isRequired>
            <FormLabel>Datum rođenja</FormLabel>
            <Input
              type="date"
              name="dob"
              value={pet.dob}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl mt={4} isRequired>
            <FormLabel>Boja</FormLabel>
            <Input
              placeholder="Boja"
              name="color"
              value={pet.color}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl mt={4} isRequired>
            <FormLabel>
              {pet.gender === "Žensko" ? "Sterilizirana" : "Kastriran"}
            </FormLabel>
            <RadioGroup
              value={pet.neutered.toString()}
              onChange={handleNeuteredChange}
            >
              <HStack spacing="24px">
                <Radio value={"true"}>Da</Radio>
                <Radio value={"false"}>Ne</Radio>
              </HStack>
            </RadioGroup>
          </FormControl>
          <FormControl mt={4} isRequired>
            <FormLabel>Vrsta</FormLabel>
            {species && !otherSpecies ? (
              <Select
                placeholder="Vrsta"
                name="speciesName"
                value={pet.speciesName}
                onChange={handleInputChange}
                inputMode="text"
                {...(pet.speciesName === "" && { color: "gray" })}
              >
                {species?.map((species, index) => (
                  <option key={index} id={species.id} value={species.name}>
                    {species.name}
                  </option>
                ))}
                <option value="Other">Nema ponuđena vrsta</option>
              </Select>
            ) : (
              <Input
                placeholder="Vrsta"
                name="speciesName"
                value={pet.speciesName}
                onChange={handleInputChange}
              />
            )}
          </FormControl>
          <FormControl mt={4} isRequired isDisabled={pet.speciesName === ""}>
            <FormLabel>Pasmina</FormLabel>
            {breeds && !otherBreed ? (
              <Select
                placeholder="Pasmina"
                name="breedName"
                value={pet.breedName}
                onChange={handleInputChange}
                {...(pet.breedName === "" && { color: "gray" })}
              >
                {breeds?.map((breed, index) => (
                  <option key={index} id={breed.id} value={breed.name}>
                    {breed.name}
                  </option>
                ))}
                <option value="Other">Nema ponuđena pasmina</option>
              </Select>
            ) : (
              <Input
                placeholder="Pasmina"
                name="breedName"
                value={pet.breedName}
                onChange={handleInputChange}
              />
            )}
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
  );
}
