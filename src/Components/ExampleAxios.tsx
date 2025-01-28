import axios from "axios";
import { use } from "react";

// Función para obtener los datos de los Pokémon
const fetchPokemonData = async () => {
    const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=100&offset=0");
    const pokemonList = response.data.results;

    return Promise.all(
        pokemonList.map(async (pokemon) => {
            const detailResponse = await axios.get(pokemon.url);
            const stats = detailResponse.data.stats.map((stat) => ({
                name: stat.stat.name,
                value: stat.base_stat,
            }));
            return {
                name: pokemon.name,
                image: detailResponse.data.sprites.front_default,
                stats,
            };
        })
    );
};

// Crear una promesa externa para que React la maneje
const pokemonDataPromise = fetchPokemonData();

function ExampleAxios() {
    // Usar el hook `use` para manejar la promesa
    const data = use(pokemonDataPromise);

    return (
        <div>
            <h3 className="text-center my-4" style={{ fontFamily: "Arial, sans-serif", color: "#007bff" }}>
                Lista de Pokémones
            </h3>
            <div className="container">
                <div className="row">
                    {data.map((pokemon, index) => (
                        <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                            <div
                                className="card shadow-sm"
                                style={{
                                    border: "1px solid rgb(39, 82, 126)",
                                    borderRadius: "10px",
                                }}
                            >
                                <img
                                    src={pokemon.image}
                                    className="card-img-top mt-3"
                                    alt={pokemon.name}
                                    style={{ width: "50%", margin: "auto" }}
                                />
                                <div className="card-body text-center">
                                    <h5 className="card-title" style={{ color: "#343a40", fontWeight: "bold" }}>
                                        {pokemon.name.toUpperCase()}
                                    </h5>
                                    <ul className="list-group list-group-flush">
                                        {pokemon.stats.map((stat, i) => (
                                            <li
                                                key={i}
                                                className="list-group-item"
                                                style={{
                                                    backgroundColor: "#fdfdfe",
                                                    fontSize: "14px",
                                                    fontFamily: "'Roboto', sans-serif",
                                                }}
                                            >
                                                {stat.name.toUpperCase()}: <strong>{stat.value}</strong>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ExampleAxios;
