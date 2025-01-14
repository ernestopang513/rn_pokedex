import { createContext, PropsWithChildren } from "react";

import {
    NavigationContainer,
    DarkTheme as NavigationDarkTheme,
    DefaultTheme as NavigationDefaultTheme,
  } from '@react-navigation/native';


import { adaptNavigationTheme,
    MD3DarkTheme,
    MD3LightTheme,
    PaperProvider 
} from 'react-native-paper';

import { useColorScheme } from "react-native";
  
  const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
  });


export const ThemeContext = createContext({
    isDark: false,
    theme: LightTheme
});




export const ThemeContextProvider = ({ children }: PropsWithChildren) => {

    const colorScheme = useColorScheme();

    const isDark = colorScheme === 'dark';

    const CombinedTheme = {
      ...MD3DarkTheme,
      colors: {
        ...(isDark ? DarkTheme.colors : LightTheme.colors),
        ...(isDark ? MD3DarkTheme.colors : MD3LightTheme.colors ),
      },
      fonts: {
        ...MD3DarkTheme.fonts,
        ...NavigationDarkTheme.fonts
      },
      dark: isDark,
    }
    
    return (
        <PaperProvider theme={CombinedTheme}  >
            <NavigationContainer theme={CombinedTheme}>
            <ThemeContext.Provider value={{
              isDark,
              theme: CombinedTheme
            }}>
                {children}
            </ThemeContext.Provider>
            </NavigationContainer>
        </PaperProvider>
    )
}


// Yo leí la documentación y lo hice a mano la combinación de los themas y me gustaria compartir mi solución. Para combinarlos imprimí en consola los temas para ver que diferencias habia entre ellos para finalmente combinarlos de forma correcta