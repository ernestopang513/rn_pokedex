import { pokeApi } from "../../config/api/pokeApi";
import type { Pokemon } from "../../domain/entities/pokemon";
import type { PokeAPIPaginatedResponse, PokeAPIPokemon } from "../../infrastructure/interfaces/pokeapi.interfaces";
import { PokemonMapper } from "../../infrastructure/mappers/pokemon.mapper";

export const sleep = async() => {
    return new Promise(resolve => setTimeout(resolve, 2000));
}


export const getPokemons = async (page: number, limit : number = 20): Promise<Pokemon[]> => {

    try {
        const url = `/pokemon?offset=${page * 10 }&limit=${limit}`;
        

        const {data} = await pokeApi.get<PokeAPIPaginatedResponse>(url);

        const pokemonPromises = data.results.map( (info) => {
            return pokeApi.get<PokeAPIPokemon>(info.url)
        })


        const pokeApiPokemon = await Promise.all(pokemonPromises)

        const pokemons = pokeApiPokemon.map(item => PokemonMapper.pokeApiPokemonToEntity(item.data))
       
        console.log(pokemons[0])

        return pokemons
    } catch (error) {
        throw new Error('Erron getting pokemons.')
    }

}