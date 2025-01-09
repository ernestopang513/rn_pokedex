import { createContext, PropsWithChildren } from "react";

import {
  DefaultTheme,
    NavigationContainer,
    DarkTheme as NavigationDarkTheme,
    DefaultTheme as NavigationDefaultTheme,
    Theme,
  } from '@react-navigation/native';
  import { adaptNavigationTheme, PaperProvider } from 'react-native-paper';
import { useColorScheme } from "react-native";
  
  const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
  });


export const ThemeContext = createContext({
    isDark: true,
    theme: LightTheme
});


export const ThemeContextProvider = ({ children }: PropsWithChildren) => {

    const colorScheme = useColorScheme();

    const isDarkTheme = colorScheme === 'dark';
    const theme = isDarkTheme ? DarkTheme : LightTheme;

    return (
        <PaperProvider theme={theme} >
            <NavigationContainer theme={{...DefaultTheme}}>
                {children}
            </NavigationContainer>
        </PaperProvider>
    )
}