import { pokeApi } from "../../config/api/pokeApi"
import { PokeAPIPokemon } from "../../infrastructure/interfaces/pokeapi.interfaces"
import { PokemonMapper } from "../../infrastructure/mappers/pokemon.mapper";




export const getPokemonById = async(id: number) => {

    try {
        
        const { data } = await pokeApi.get<PokeAPIPokemon>(`/pokemon/${id}`);
        const pokemon = await PokemonMapper.pokeApiPokemonToEntity(data)


        return pokemon;

    } catch (error){
        throw new Error(`Error getting pokemon by id: ${id}`)
    }
}