import { StyleSheet, View } from "react-native"
import { Text } from "react-native-paper"
import { getPokemons } from "../../../actions/pokemons"
import { useQuery } from "@tanstack/react-query"
import { PokeballBg } from "../../components/ui/PokeballBg"

export const HomeScreen = () => {

  const { isLoading, data = []}  = useQuery({
    queryKey: ['pokemon'],
    queryFn: () => getPokemons(0),
    staleTime: 1000 * 60 * 60
  });

  // getPokemons(0);

  return (
    <View >
        <Text>HomeScreen</Text>
        <Text variant="bodyLarge" lineBreakMode="middle">HomeScreen</Text>
        <Text>HomeScreen</Text>

        <PokeballBg style={styles.imgPosition} />

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