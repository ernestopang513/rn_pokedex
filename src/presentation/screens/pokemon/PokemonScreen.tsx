
import { RouteProp, useRoute } from "@react-navigation/native"
import { FlatList, Image, ScrollView, StyleSheet, View } from "react-native"
import { Chip, Text } from "react-native-paper"
import { RootStackParams } from "../../navigator/StackNavigator"
import { StackScreenProps } from "@react-navigation/stack"
import { useQuery } from "@tanstack/react-query"
import { getPokemonById } from "../../../actions/pokemons"
import { FullScreenLoader } from "../../components/ui/FullScreenLoader"
import { Formatter } from '../../../config/helpers/formatter';
import { FadeInImage } from "../../components/ui/FadeInImage"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useContext } from "react"
import { ThemeContext } from "../../context/ThemeContext"
import FastImage from "react-native-fast-image"
import { transparent } from "react-native-paper/lib/typescript/styles/themes/v2/colors"

interface Props extends StackScreenProps<RootStackParams, 'PokemonScreen'>{}

export const PokemonScreen = ({navigation, route}: Props) => {


  //* Extrancion de parametros con useRoute
  // const route =useRoute<RouteProp<RootStackParams, 'PokemonScreen'>>()
  // const {pokemonId} = route.params

  const {isDark, theme} = useContext(ThemeContext);


  const {top} = useSafeAreaInsets();

  const {pokemonId} = route.params;

  const pokeballImg = isDark
    ? require('../../../assets/pokeball-light.png')
    : require('../../../assets/pokeball-dark.png');


  const {isLoading, data: pokemon} = useQuery({
    queryKey: ['pokemon', pokemonId],
    queryFn: () => getPokemonById(pokemonId),
    staleTime: 1000 * 60 * 60, // 1 hour
  })
  if (!pokemon) {
    return (
      <FullScreenLoader/>
    )
  }

  // console.log(pokemon.id)

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: pokemon.color }}
      bounces={false}
      showsVerticalScrollIndicator={false}>
      {/* Header Container */}
      <View style={styles.headerContainer}>
        {/* Nombre del Pokemon */}
        <Text
          style={{
            ...styles.pokemonName,
            top: top + 5,
          }}>
          {Formatter.capitalize(pokemon.name) + '\n'}#{pokemon.id}
        </Text>

        {/* Pokeball */}
        <Image source={pokeballImg} style={styles.pokeball} />

        <FadeInImage uri={pokemon.avatar} style={styles.pokemonImage} />
      </View>

      {/* Types */}
      <View
        style={{ flexDirection: 'row', marginHorizontal: 20, marginTop: 10 }}>
        {pokemon.types.map(type => (
          <Chip
            key={type}
            mode="outlined"
            selectedColor='white'
            style={{ marginLeft: 10 , backgroundColor: 'transparent'}}>
            {type}
          </Chip>
        ))}
      </View>

      {/* Sprites */}
      <FlatList
        data={pokemon.sprites}
        horizontal
        keyExtractor={(item, index) => (item ?? `temp-${index}`)}
        showsHorizontalScrollIndicator={false}
        centerContent
        style={{
          marginTop: 20,
          height: 100,
        }}
        renderItem={({ item }) =>{ 
          
          // if(!item) return (<Text style={{alignSelf: 'center'}}>No image</Text>)
            
          if(!item) return (<Image source={pokeballImg} style={{width: 40, height: 40, marginHorizontal: 5, alignSelf: 'center'}} />)
          
            return (
          <FadeInImage
            uri={item}
            style={{ width: 100, height: 100, marginHorizontal: 5 }}
          />
        )}}

        
      />

      <FastImage
        style={{width: 60, height: 60, position: 'absolute',right: 20, top: 20}}
        source={{
          // uri: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/6.gif",
          uri: pokemon.sprites[pokemon.sprites.length-2],
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.contain}
      />

      

      <Text style={styles.subTitle}>Abilities</Text>
      <FlatList

        data={pokemon.abilities}
        horizontal
        keyExtractor={item => item}
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => (
          <Chip style={{marginLeft: 10, backgroundColor: 'transparent'}} selectedColor='white' mode={'outlined'} >{Formatter.capitalize(item)}</Chip>
        )}

      />

      <View style={{ height: 20 }} />

      
      <Text style={styles.subTitle}>Stats</Text>

      <FlatList
      data={pokemon.stats}
      keyExtractor={item => item.name}
      horizontal
      showsHorizontalScrollIndicator={false}
      renderItem={({item})=>(
        <View style={[styles.statsContainer, {paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.3)'}]}>
          <Text style={{flex: 1, color: 'white'}}>
            {Formatter.capitalize(item.name)}
          </Text>
          <Text style={{color: 'white'}}>{item.value}</Text>
        </View>
      )}
      />

      <View style={{ height: 20 }} />


      {pokemon.moves.length > 0 && <Text style={styles.subTitle}>Moves</Text>}

      {pokemon.moves.length > 0 &&
      
          <FlatList
          data={pokemon.moves}
          keyExtractor={item => item.name}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item})=>{
            return (
            <View style={[styles.statsContainer, {paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.3)'}]}>
              <Text style={{flex: 1, color: 'white'}}>
                {Formatter.capitalize(item.name)}
              </Text>
              <Text style={{color: 'white'}}>lvl {item.level}</Text>
            </View>
          )}}
          />
      }

      {pokemon.moves.length > 0 && <View style={{ height: 20 }} />}


      <Text style={styles.subTitle}>Games</Text>

      <FlatList
// ?? ['No games']
        data={pokemon.games.length > 0 ? pokemon.games : ['No games'] }
        horizontal
        keyExtractor={item => item}
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => {
          
          return (
          <Chip mode="outlined" style={{marginLeft: 10, backgroundColor: 'transparent'}} selectedColor='white'>{Formatter.capitalize(item)}</Chip>
        )}}

      />

      <View style={{ height: 100 }} />

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 370,
    zIndex: 999,
    alignItems: 'center',
    borderBottomRightRadius: 1000,
    borderBottomLeftRadius: 1000,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  pokemonName: {
    color: 'white',
    fontSize: 40,
    alignSelf: 'flex-start',
    left: 20,
  },
  pokeball: {
    width: 250,
    height: 250,
    bottom: -20,
    opacity: 0.7,
  },
  pokemonImage: {
    width: 240,
    height: 240,
    position: 'absolute',
    bottom: -40,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: 'column',
    marginHorizontal: 20,
    alignItems: 'center',
  },
  
});