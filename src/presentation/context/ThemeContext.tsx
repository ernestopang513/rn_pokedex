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
});




export const ThemeContextProvider = ({ children }: PropsWithChildren) => {

    const colorScheme = useColorScheme();

    const isDark = colorScheme === 'dark';

    const CombinedTheme = {
      ...MD3LightTheme,
      colors: {
        ...(isDark ? DarkTheme.colors : LightTheme.colors),
        ...(isDark ? MD3DarkTheme.colors : MD3LightTheme.colors ),
      },
      fonts: {
        ...MD3DarkTheme.fonts,
        ...NavigationDefaultTheme.fonts
      },
      dark: isDark,
    }
    

    // console.log(JSON.stringify(LightTheme.colors.primary, null, 4))
    // console.log('------------------------------------------------------')
    // console.log(JSON.stringify(CombinedTheme.colors.primary, null, 3))
    // console.log('------------------------------------------------------')
    // console.log(JSON.stringify(MD3DarkTheme.colors.primary, null, 3))
    // console.log('------------------------------------------------------')
    // console.log(JSON.stringify(CombinedTheme.colors, null, 3))
    // console.log({isDark})


    // console.log(JSON.stringify(NavigationDarkTheme, null, 3))
    
    return (
        <PaperProvider theme={CombinedTheme}  >
            <NavigationContainer theme={CombinedTheme}>
            <ThemeContext.Provider value={{
              isDark
            }}>
                {children}
            </ThemeContext.Provider>
            </NavigationContainer>
        </PaperProvider>
    )
}