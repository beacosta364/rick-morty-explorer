import type { Character } from "./character";

export interface CharacterResponse {
  characters: Character[];
  totalPages: number;
}