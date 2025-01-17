import ImageColors from "react-native-image-colors";
import { darkenColor } from "./darkenColor";

export const getColorFromImage = async(image: string) => {

    const fallbackColor = 'grey';

    const colors = await ImageColors.getColors(image, {
        fallback: fallbackColor,
    });


    // switch (colors.platform) {
    //     case 'android':
    //         return colors.dominant ?? fallbackColor

    //     case 'ios': 
    //         return colors.background ?? fallbackColor;
    //     default: 
    //         return fallbackColor;
    // }

    switch (colors.platform) {
        case 'android':
            return darkenColor(colors.dominant) ?? fallbackColor
            // return colors.dominant ?? fallbackColor

        case 'ios': 
            return colors.background ?? fallbackColor;
        default: 
            return fallbackColor;
    }
};