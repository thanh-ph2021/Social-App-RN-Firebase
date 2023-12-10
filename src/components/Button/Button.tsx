import { Text, TouchableOpacity } from "react-native"
import { COLORS, SIZES, FONTS } from "../../constants"

interface ButtonProps {
    title: string,
    onPress: () => void,
    backgroundColor?: string,
    textColor?: string,
}

const Button = ({title, onPress, backgroundColor, textColor}: ButtonProps) => {
    return (
        <TouchableOpacity style={{ backgroundColor: backgroundColor ?? COLORS.green, margin: SIZES.base, borderRadius: SIZES.base }} onPress={onPress}>
            <Text style={{ padding: SIZES.base, ...FONTS.body3, color: textColor ?? COLORS.black }}>{title}</Text>
        </TouchableOpacity>
    )
}

export default Button