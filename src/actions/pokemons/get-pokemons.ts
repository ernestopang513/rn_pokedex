import { pokeApi } from "../../config/api/pokeApi";
import { Pokemon } from "../../domain/entities/pokemon";




export const getPokemons = async (): Promise<Pokemon[]> => {

    try {
        const url = '/pokemon';

        const {data} = await pokeApi.get(url);

        console.log(JSON.stringify(data, null, 4));
        console.log(typeof(data));

        return []
    } catch (error) {
        throw new Error('Erron getting pokemons.')
    }

}