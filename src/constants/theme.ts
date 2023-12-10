
import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

export const COLORS = {
    // base colors
    primary: "#7F5DF0",
    secondary: "#5D2DFD",

    //colors
    white: "#FFFFFF",
    black: "#000000",
    green: '#37E39F',
    blue: '#2727e8',
    lightBlue: '#c6def5',
    red: '#751a1e',
    lightRed: "#fccacd",
    gray: "#6A6A6A",
    lightGray: "#dbdbdb",
    lightGray2: "#f5f6fa",  
}

export const SIZES = {
    // global sizes
    base: 8,
    font: 14,
    radius: 12,
    padding: 12,
    
    icon: 25,

    // font sizes
    h1: 30,
    h2: 22,
    h3: 16,
    h4: 14,
    body1: 30,
    body2: 22,
    body3: 16,
    body4: 14,
    body5: 12,

    // app dimensions
    width,
    height
}

export const FONTS = {
    h1: { fontFamily: "Roboto-Black", fontSize: SIZES.h1, lineHeight: 36},
    h2: { fontFamily: "Roboto-Bold", fontSize: SIZES.h2, lineHeight: 30},
    h3: { fontFamily: "Roboto-Bold", fontSize: SIZES.h3, lineHeight: 22},
    h4: { fontFamily: "Roboto-Bold", fontSize: SIZES.h4, lineHeight: 22},
    body1: { fontFamily: "Roboto-Regular", fontSize: SIZES.body1, lineHeight: 36},
    body2: { fontFamily: "Roboto-Regular", fontSize: SIZES.body2, lineHeight: 30},
    body3: { fontFamily: "Roboto-Regular", fontSize: SIZES.body3, lineHeight: 22},
    body4: { fontFamily: "Roboto-Regular", fontSize: SIZES.body4, lineHeight: 22},
    body5: { fontFamily: "Roboto-Regular", fontSize: SIZES.body5, lineHeight: 18},
}

const appTheme = {COLORS, SIZES, FONTS}

export default appTheme;