import { ActivityIndicator, FlatList, StyleSheet, useWindowDimensions, View, ImageBackground } from 'react-native';
import { Text } from "react-native-paper"
import { getPokemons } from "../../../actions/pokemons"
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query"
import { PokeballBg } from "../../components/ui/PokeballBg"
import { globalTheme } from "../../../config/theme/global-theme"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { PokemonCard } from "../../components/pokemons/PokemonCard"
import { Pokemon } from "../../../domain/entities/pokemon"
import { useContext } from "react"
import { ThemeContext } from "../../context/ThemeContext"

export const HomeScreen = () => {

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
  
  
  const { isLoading, data, fetchNextPage}  = useInfiniteQuery({
    queryKey: ['pokemon', 'infinite'],
    staleTime: 1000 * 60 * 60, // 60 minutos
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
  });

  

  return (
    <View style={[globalTheme.globalMargin, {flex: 1}]}>
        <PokeballBg style={styles.imgPosition} />
        
        <FlatList
          data={data?.pages.flat() ?? []}
          keyExtractor={(pokemon,index)=> `${pokemon.id}-${index}`}
          numColumns={2}
          style={{paddingTop: top + 20}}
          contentContainerStyle = {{paddingBottom: top + 20}}
          // style={{paddingVertical: top + 20}}
          ListHeaderComponent={()=>(
            <Text variant="displayMedium">Pokédex</Text>
          )}
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