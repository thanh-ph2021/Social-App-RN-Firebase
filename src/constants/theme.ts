
import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

export const COLORS = {
    // base colors
    darkBlack: "#181A1C",
    socialWhite: "#ECEBED",
    gradient: ["#F62E8E", "#AC1AF0"],
    socialBlue: "#2E8AF6",
    socialPink: "#F62E8E",
    darkGrey: "#323436",
    darkGrey2: "#2f2f30",
    lightGrey: "#727477",


    //colors
    white: "#FFFFFF",
    black: "#000000",
    green: "#32a852",
    text: "#FFFFFF",
    blue: "blue",
    yellow: '#ad9613',
    red: '#7d0606'
}

export const SIZES = {
    divider: 1,
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

export const URL_HOSTING = 'http://192.168.0.13:8086/api/notification/send'

const appTheme = {COLORS, SIZES, FONTS, URL_HOSTING}

export default appTheme;