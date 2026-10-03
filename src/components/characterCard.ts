import type { Character } from "../interfaces/character";

export const createCharacterCard = (
  character: Character,
  detailed: boolean = false
) => {
  return `
    <article class="character-card">
      <h2>${character.name}</h2>
      <p>ID: ${character.id}</p>
      ${detailed ? `
        <p>Estado: ${character.status}</p>
        <p>Especie: ${character.species}</p>
        <p>Género: ${character.gender}</p>
      ` : ""}
      <img src="${character.image}" alt="${character.name}">
    </article>
  `;
};