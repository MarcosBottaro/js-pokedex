const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");
const modal = document.getElementById("pokemonModal");

const maxRecords = 151;
const limit = 10;
let offset = 0;

//Converter os dados para uma lista
function convertPokemonToLi(pokemon) {
  return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types
                      .map((type) => `<li class="type ${type}">${type}</li>`)
                      .join("")}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
            
 <button class="btn-details" data-id="${pokemon.number}">Detalhes</button>
        </li>
    `;
}

//Receber os dados do pokemon
function loadPokemonItens(offset, limit) {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    const newHtml = pokemons.map(convertPokemonToLi).join("");
    pokemonList.innerHTML += newHtml;
  });
}

//Evento de click para o botao detalhes
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("btn-details")) {
    const pokemonId = event.target.dataset.id;

    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
      .then((response) => response.json())
      .then((data) => {
        modal.style.display = "block";

        // Atualiza o conteúdo do modal com os dados do Pokémon
        const pokemonName = document.getElementById("pokemonName");
        const pokemonHp = document.getElementById("pokemonHp");
        const pokemonAttack = document.getElementById("pokemonAttack");
        const pokemonDefense = document.getElementById("pokemonDefense");
        const pokemonSpecialAttack = document.getElementById(
          "pokemonSpecialAttack"
        );
        const pokemonSpecialDefense = document.getElementById(
          "pokemonSpecialDefense"
        );

        pokemonName.textContent = data.name;
        pokemonHp.textContent = data.stats[0].base_stat;
        pokemonAttack.textContent = data.stats[1].base_stat;
        pokemonDefense.textContent = data.stats[2].base_stat;
        pokemonSpecialAttack.textContent = data.stats[3].base_stat;
        pokemonSpecialDefense.textContent = data.stats[4].base_stat;
      });

    const closeButton = modal.querySelector(".close");
    closeButton.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }
});

loadPokemonItens(offset, limit);

//Botão para carregar mais pokemons
loadMoreButton.addEventListener("click", () => {
  offset += limit;
  const qtdRecordsWithNexPage = offset + limit;

  if (qtdRecordsWithNexPage >= maxRecords) {
    const newLimit = maxRecords - offset;
    loadPokemonItens(offset, newLimit);

    loadMoreButton.parentElement.removeChild(loadMoreButton);
  } else {
    loadPokemonItens(offset, limit);
  }
});
