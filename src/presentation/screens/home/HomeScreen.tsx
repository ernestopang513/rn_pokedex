import { View } from "react-native"
import { Button, Text } from "react-native-paper"

export const HomeScreen = () => {
  return (
    <View>
        <Text>HomeScreen</Text>

        <Button mode="contained" onPress={() => console.log('Pressed')}>
          Press me
        </Button>
    </View>
  )
}