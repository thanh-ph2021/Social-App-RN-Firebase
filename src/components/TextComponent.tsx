import { StyleProp, TextStyle, Text, Platform } from "react-native"
import { utilStyles } from "../styles"
import { COLORS } from "../constants"

interface Props {
    text?: string,
    color?: string,
    size?: number,
    flex?: number,
    styles?: StyleProp<TextStyle>,
    title?: boolean,
    numberOfLines?: number
}
const TextComponent = (props: Props) => {

    const { text, color, size, flex, styles, title, numberOfLines } = props

    const fontSizeDefault = Platform.OS === 'ios' ? 16 : 14

    return (
        <Text
            numberOfLines={numberOfLines}
            style={[
                utilStyles.text,
                {
                    color: color ?? COLORS.text,
                    flex: flex ?? 0,
                    fontSize: size ? size : title ? 18 : fontSizeDefault
                },
                styles,
            ]}
        >
            {text}
        </Text>
    )
}

export default TextComponent