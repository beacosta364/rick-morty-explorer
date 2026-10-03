import type { CharacterResponse } from "../interfaces/characterResponse";
import type { RickAndMortyApiResponse } from "../interfaces/rickAndMortyApiResponse";
import type { Character } from "../interfaces/character";

export const getCharacters = async (
  page: number,
  name: string = "",
  id?: number
): Promise<CharacterResponse> => {
  const url = id !== undefined
  ? `https://rickandmortyapi.com/api/character/${id}`
    : name
      ? `https://rickandmortyapi.com/api/character?page=${page}&name=${encodeURIComponent(name)}`
      : `https://rickandmortyapi.com/api/character?page=${page}`;

  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 404) {
      return {
        characters: [],
        totalPages: 0,
      };
    }

    throw new Error("No fue posible obtener los personajes");
  }

  if (id !== undefined) {
    const data: Character = await response.json();

    return {
      characters: [data],
      totalPages: 1,
    };
  }

  const { results, info }: RickAndMortyApiResponse = await response.json();

  return {
    characters: results,
    totalPages: info.pages,
  };
};