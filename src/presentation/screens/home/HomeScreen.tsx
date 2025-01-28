import { ActivityIndicator, FlatList, StyleSheet, useWindowDimensions, View, ImageBackground } from 'react-native';
import { FAB, Text } from "react-native-paper"
import { getPokemons } from "../../../actions/pokemons"
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query"
import { PokeballBg } from "../../components/ui/PokeballBg"
import { globalTheme } from "../../../config/theme/global-theme"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { PokemonCard } from "../../components/pokemons/PokemonCard"
import { useContext } from "react"
import { ThemeContext } from "../../context/ThemeContext"
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigator/StackNavigator';

interface Props extends StackScreenProps<RootStackParams, 'HomeScreen'>{}

export const HomeScreen = ({navigation}: Props) => {

  const {top} = useSafeAreaInsets();
  const {height} = useWindowDimensions();
  const {theme:{colors:{text}}} = useContext(ThemeContext);
  const queryClient = useQueryClient();

  //* Esta es la forma tradicional de una petición http
  // const { isLoading, data: pokemons = []}  = useQuery({
  //   queryKey: ['pokemon'],
  //   queryFn: () => getPokemons(0),
  //   staleTime: 1000 * 60 * 60
  // });
  
  // ! Para esta función de useQuery es importante tener al final getNextPageParam
  //! Sí no, no infiere el tipo de dato de pokémon
  const { isLoading, data, fetchNextPage}  = useInfiniteQuery({
    queryKey: ['pokemon', 'infinite'],
    // getNextPageParam: ( lastPage, pages) => pages.length,
    initialPageParam: 0,
    // queryFn: (params) => getPokemons(params.pageParam),
    queryFn: async(params) => {
      const pokemons = await getPokemons(params.pageParam);
      
      pokemons.forEach(pokemon => {
        queryClient.setQueryData(['pokemon', pokemon.id], pokemon)
      })
      
      return pokemons;
    },
    getNextPageParam: ( lastPage, pages) => pages.length,
    staleTime: 1000 * 60 * 60, // 60 minutos
  });

  

  return (
    <View style={[globalTheme.globalMargin, {flex: 1}]}>
        <PokeballBg style={styles.imgPosition} />
        
        <FlatList
          //* Aqui data es un arreglo de tipo pokémon
          data={data?.pages.flat() ?? []}
          //* En este KeyExtractor es de tipo iterativo e itera el arreglo que meto en data
          keyExtractor={(pokemon,index)=> `${pokemon.id}-${index}`}
          numColumns={2}
          style={{paddingTop: top + 20}}
          //* En este caso tuve que usar el contentContainerStyle por que el ListFooterComponent se cortaba devido al paddingTop que toma
          //* el top + 20 por lo tanto compensa lo tomado para que el ultimo elemento aparesca por completo
          contentContainerStyle = {{paddingBottom: top + 20}}
          ListHeaderComponent={()=>(
            <Text variant="displayMedium">Pokédex</Text>
          )}
          //* Aqui el item que se pasa es un objeto del arreglo data el tipado lo verifica el 
          //* componente PokemonCard dentro de el esta la interface Prop que contiene pokemon con tipo de dato Pokémon
          renderItem={({item}) => <PokemonCard pokemon={item}/>}
          onEndReachedThreshold={0.6}
          onEndReached={() => fetchNextPage()}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={() => (
            <View style={{height: height * 0.16, justifyContent: 'center', }}>
              <ActivityIndicator  size={'large'} color={text}/>
            </View>
          )}
        />

        <FAB
          style={[globalTheme.fab]}
          icon={'search'}
          mode='elevated'
          onPress={()=> navigation.push('SearchScreen')}
        />
    </View>
  )
}


const styles = StyleSheet.create({
  imgPosition: {
    position: 'absolute',
    top: -100,
    right: -100,
  }
})