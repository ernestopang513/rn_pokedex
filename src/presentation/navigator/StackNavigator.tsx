
import { createStackNavigator } from "@react-navigation/stack"
import { Text, View } from "react-native"
import { HomeScreen } from "../screens/home/HomeScreen";
import { PokemonScreen } from "../screens/pokemon/PokemonScreen";
import { SearchScreen } from "../screens/search/SearchScreen";

// Este type me permite tener autocompletado en los diferentes screens
// Limitó el tipo, la cantidad de rutas y el tipo y cantidad de parametros
export type RootStackParams = {
  HomeScreen: undefined;
  PokemonScreen: {pokemonId: number};
  SearchScreen: undefined;
}

const Stack = createStackNavigator<RootStackParams>();

export const StackNavigator = () => {
  return (
        <Stack.Navigator screenOptions={{
          headerShown: false,
        }}>
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="PokemonScreen" component={PokemonScreen} />
            <Stack.Screen name="SearchScreen" component={SearchScreen} />
        </Stack.Navigator>
  )
}