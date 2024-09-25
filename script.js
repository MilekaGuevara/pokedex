const boton = document.querySelector('#boton');
const labelBusPoke = document.querySelector('#busqueda');
const cardPo = document.querySelector('#contenedor');
const antes = document.querySelector('#previust');
const siguiente = document.querySelector('#next');
const tipoSelect = document.querySelector('#tipoP');
let urlP = 'https://pokeapi.co/api/v2/pokemon?limit=20';
const tipoTraducido = {
    normal: "Normal",
    fire: "Fuego",
    water: "Agua",
    electric: "Eléctrico",
    grass: "Planta",
    ice: "Hielo",
    fighting: "Lucha",
    poison: "Veneno",
    ground: "Tierra",
    flying: "Volador",
    psychic: "Psíquico",
    bug: "Bicho",
    rock: "Roca",
    ghost: "Fantasma",
    dragon: "Dragón",
    dark: "Siniestro",
    steel: "Acero",
    fairy: "Hada"
};
const getData = async (url) => {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Error al obtener datos:', error);
        return null;
    }
};

const mostrarInfoPokemon = (info) => {
    alert(`Nombre: ${info.name}\nEXP: ${info.base_experience}\nAltura: ${info.height}\nPeso: ${info.weight}`);
};

const crearCard = (pokemon) => {
    const card = document.createElement('div');
    card.classList.add('card', 'col-4', 'mx-auto');

    const img = document.createElement('img');
    img.src = pokemon.sprites.front_default;
    img.alt = pokemon.name;

    const body = document.createElement('div');
    body.classList.add('card-body');

    const nombrePok = document.createElement('p');
    nombrePok.textContent = `Nombre: ${pokemon.name}`;

    const experienciaPok = document.createElement('p');
    experienciaPok.textContent = `EXP: ${pokemon.base_experience}`;

    const botonInfo = document.createElement('button');
    botonInfo.classList.add('btn', 'btn-outline-success');
    botonInfo.textContent = 'Más información';
    botonInfo.addEventListener('click', () => mostrarInfoPokemon(pokemon));

    body.appendChild(nombrePok);
    body.appendChild(experienciaPok);
    body.appendChild(botonInfo);
    card.appendChild(img);
    card.appendChild(body);
    cardPo.appendChild(card);
};
const mostrarPokemon = async (url) => {
    cardPo.innerHTML = '';
    const data = await getData(url);
    if (data && data.results) {
        for (let poke of data.results) {
            const pokemon = await getData(poke.url);
            crearCard(pokemon);
        }
    }
};

const filtrarPorTipo = async (tipo) => {
    cardPo.innerHTML = '';
    if (tipo === 'todos') {
        mostrarPokemon('https://pokeapi.co/api/v2/pokemon?limit=20');
    } else {
        const data = await getData(`https://pokeapi.co/api/v2/type/${tipo}`);
        if (data && data.pokemon) {
            for (let poke of data.pokemon) {
                const pokemon = await getData(poke.pokemon.url);
                crearCard(pokemon);
            }
        }
    }
};

const cargarTipos = async () => {
    const tipos = await getData('https://pokeapi.co/api/v2/type');
    if (tipos && tipos.results) {
        tipos.results.forEach(tipo => {
            const option = document.createElement('option');
            option.value = tipo.name;
            option.textContent = tipoTraducido[tipo.name] || tipo.name; 
            tipoSelect.appendChild(option);
        });
    }
};

boton.addEventListener('click', async () => {
    const nombre = labelBusPoke.value.toLowerCase();
    if (nombre === '') {
        alert('Por favor, ingresa el nombre del Pokémon.');
        return;
    }
    const pokemon = await getData(`https://pokeapi.co/api/v2/pokemon/${nombre}`);
    if (pokemon) {
        cardPo.innerHTML = '';
        crearCard(pokemon);
    } else {
        alert('Pokémon no encontrado.');
    }
});
tipoSelect.addEventListener('change', (e) => {
    const tipoSeleccionado = e.target.value;
    filtrarPorTipo(tipoSeleccionado);
});

cargarTipos();
mostrarPokemon(urlP);

antes.addEventListener('click', async () => {
    const data = await getData(urlP);
    if (data && data.previous) {
        urlP = data.previous;
        mostrarPokemon(urlP);
    }
});

siguiente.addEventListener('click', async () => {
    const data = await getData(urlP);
    if (data && data.next) {
        urlP = data.next;
        mostrarPokemon(urlP);
    }
});
