import type { Character } from "./character";

export interface CharacterResponse {
  characters: Character[];
  totalPages: number;
}

/*
{
    characters: [
        {
            id: 1,
            name: "Rick Sanchez",
            status: "Alive",
            species: "Human",
            gender: "Male",
            image: "..."
        }
    ],
    totalPages: 42
}*/