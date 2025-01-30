
import { FlatList, View } from "react-native"
import { ActivityIndicator, Text, TextInput } from "react-native-paper"
import { globalTheme } from "../../../config/theme/global-theme"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { PokemonCard } from "../../components/pokemons/PokemonCard"
import { useMemo, useState } from 'react';
import { useQuery } from "@tanstack/react-query"
import { getPokemonNamesWithId, getPokemonsByIds } from "../../../actions/pokemons"
import { FullScreenLoader } from "../../components/ui/FullScreenLoader"
import { useDebounceValue } from "../../hooks/useDebounceValue"

export const SearchScreen = () => {
  const {top} = useSafeAreaInsets();
  const [term, setTerm] = useState('');

  const debouncedValue = useDebounceValue(term)

  const {isLoading, data: pokemonNameList = []} = useQuery({
    queryKey: [ 'pokemons', 'all'],
    queryFn: () => getPokemonNamesWithId(),
  })

  // console.log(JSON.stringify(pokemonNameList,null, 5))
  // console.log(pokemonNameList.length)

  const pokemonNameIdList = useMemo(() => {

    if (!isNaN(Number(debouncedValue))){
      const pokemon = pokemonNameList.find(
        pokemon => pokemon.id === Number(debouncedValue),
      );
      return pokemon ? [pokemon]: [];
    }

    if (debouncedValue.length === 0 ) return [];
    if (debouncedValue.length < 3) return [];

    return pokemonNameList.filter(pokemon => pokemon.name.includes(debouncedValue.toLowerCase()))


  }, [debouncedValue]);

  const {isLoading: isLoadingPokemons, data: pokemons = [] } = useQuery({
    queryKey: ['pokemons', 'by', pokemonNameIdList],
    queryFn: () => getPokemonsByIds(pokemonNameIdList.map(pokemon => pokemon.id)),
    staleTime: 1000 * 60 * 5 // 5 minutos
  })

  if (isLoading) {
    return (<FullScreenLoader/>)
  }
  
  return (
    <View style={[globalTheme.globalMargin, {paddingTop: 10 + top}]}>
      <TextInput
        placeholder="Buscar Pokémon"
        mode = 'flat'
        autoFocus
        autoCorrect={false}
        onChangeText={setTerm}
        value={term}
      />

      {isLoadingPokemons && <ActivityIndicator style={{paddingTop: 20}}/> }

      {/* <Text>{JSON.stringify(pokemonNameIdList, null, 2)}</Text> */}

      <FlatList
        //Aqui data es un arreglo de tipo pokémon
        data={ pokemons}
        // En este KeyExtractor es de tipo iterativo e itera el arreglo que meto en data
        // keyExtractor={(pokemon,index)=> {console.log({pokemon: pokemon.id + ' '});  return `${pokemon.id}-${index}`}}
        keyExtractor={(pokemon,index)=> (`${pokemon.id}-${index}`)}
        numColumns={2}
        style={{paddingTop: top + 20}}
        // En este caso tuve que usar el contentContainerStyle por que el ListFooterComponent se cortaba devido al paddingTop que toma
        // el top + 20 por lo tanto compensa lo tomado para que el ultimo elemento aparesca por completo
        contentContainerStyle = {{paddingBottom: top + 80}}
        //Aqui el item que se pasa es un objeto del arreglo data el tipado lo verifica el 
        // componente PokemonCard dentro de el esta la interface Prop que contiene pokemon con tipo de dato Pokémon
        renderItem={({item}) => <PokemonCard pokemon={item}/>}
        onEndReachedThreshold={0.6}
        showsVerticalScrollIndicator={false}
      />
      
    </View>
  )
} 