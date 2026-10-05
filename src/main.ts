import "./style.css";
import { getCharacters } from "./services/rickAndMortyApi";
import { createCharacterCard } from "./components/characterCard";
import type { CharacterResponse } from "./interfaces/characterResponse";

const app = document.querySelector<HTMLDivElement>("#app");
/*
¿Encontró el elemento?
       │
   ┌───┴───┐
   │       │
   Sí      No
   │       │
   ▼       ▼
  div     null
*/

let currentPage = 1;
let totalPages = 0;
let currentSearch = "";
let previousButton: HTMLButtonElement | null = null;
let nextButton: HTMLButtonElement | null = null;


const loadCharacters = async (
  name: string = "",
  id?: number
): Promise<boolean> => {
  const loading =
    document.querySelector<HTMLParagraphElement>("#loading");

  if (nextButton) {
    nextButton.disabled = true;
  }

  if (previousButton) {
    previousButton.disabled = true;
  }

  if (loading) {
    loading.textContent = `Cargando página ${currentPage}...`;
    loading.style.display = "block";
  }

  let response: CharacterResponse;

  try {
    response = await getCharacters(currentPage, name, id);
  } catch (error) {
  console.error(error);

  const errorMessage =
    document.querySelector<HTMLParagraphElement>("#error-message");

  if (errorMessage) {
    errorMessage.textContent =
      "No fue posible cargar los personajes. Intenta nuevamente.";
  }
  if (nextButton) {
    nextButton.disabled = false;
  }

  if (previousButton) {
    previousButton.disabled = false;
  }

  return false;
  } finally {
      if (loading) {
        loading.style.display = "none";
        loading.textContent = "";
      }
    }

  totalPages = response.totalPages;

  const errorMessage =
    document.querySelector<HTMLParagraphElement>("#error-message");

  const pageNumber =
    document.querySelector<HTMLParagraphElement>("#page-number");

  if (response.characters.length === 0) {
    if (errorMessage) {
      errorMessage.textContent = "No se encontraron personajes.";
    }

    if (previousButton) {
      previousButton.disabled = true;
    }

    if (nextButton) {
      nextButton.disabled = true;
    }

    if (pageNumber) {
      pageNumber.textContent = "Sin resultados";
    }

    renderCharacters(response.characters);
    
    return true;
  }


  if (pageNumber) {
    pageNumber.textContent = `Página ${currentPage} de ${totalPages}`;
  }

  if (previousButton) {
    previousButton.disabled = currentPage <= 1;
  }

  if (nextButton) {
    nextButton.disabled = currentPage >= totalPages;
  }

  renderCharacters(response.characters, id !== undefined);

  return true;
};

const renderApp = () => {
  if (!app) {
    return;
  }


  app.innerHTML = `
  <h1>Rick and Morty Explorer</h1>

  <div class="search-container">
    <input
      type="text"
      id="search-input"
      placeholder="Buscar por nombre o ID..."
    />
    <button id="search-button">Buscar</button>
  </div>

  <p id="loading">Cargando...</p>
  <p id="error-message"></p>

  <div id="characters"></div>

  <div class="pagination">
  <button id="previous-page">Anterior</button>
  
  <p id="page-number">Página ${currentPage}</p>
  
  <button id="next-page">Siguiente</button>
  </div>
`;
};

const renderCharacters = (
  characters: CharacterResponse["characters"],
  detailed: boolean = false
) => {
  const charactersContainer =
    document.querySelector<HTMLDivElement>("#characters");

  if (charactersContainer) {
    charactersContainer.innerHTML = "";

    if (detailed) {
      charactersContainer.classList.add("detailed-view");
      const [character] = characters;

      charactersContainer.innerHTML = createCharacterCard(
        character,
        true
      );

      return;
    }
    charactersContainer.classList.remove("detailed-view");

    for (const character of characters) {
      charactersContainer.innerHTML += createCharacterCard(
        character,
        detailed
      );
    }
  }
};

try {
  renderApp();

  nextButton =
    document.querySelector<HTMLButtonElement>("#next-page");

  previousButton =
    document.querySelector<HTMLButtonElement>("#previous-page");

  const searchInput =
    document.querySelector<HTMLInputElement>("#search-input");

  const searchButton =
    document.querySelector<HTMLButtonElement>("#search-button");

  searchButton?.addEventListener("click", async () => {
    currentPage = 1;

    const value = searchInput?.value.trim() ?? "";

    // if (!isNaN(Number(value)) && value !== "") {
    if (Number.isInteger(Number(value)) && value !== "") {
    currentSearch = "";
    await loadCharacters("", Number(value));
  } else {
    currentSearch = value;
    await loadCharacters(value);
  }
  });

  searchInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      searchButton?.click();
    }
  });

  previousButton?.addEventListener("click", async () => {
    if (currentPage > 1) {
      currentPage--;

      const success = await loadCharacters(currentSearch);

      if (!success) {
        currentPage++;
      }
    }
  });

  nextButton?.addEventListener("click", async () => {
    if (currentPage < totalPages) {
      currentPage++;

      const success = await loadCharacters(currentSearch);

      if (!success) {
        currentPage--;
      }
    }
  });

  await loadCharacters();
} catch (error) {
  console.error(error);
}