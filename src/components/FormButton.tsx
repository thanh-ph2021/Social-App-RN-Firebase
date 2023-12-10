import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from "react-native"
import { COLORS, SIZES, FONTS } from "../constants"

interface Props {
    buttonTitle: string
}

type FormButtonProps = TouchableOpacityProps & Props

const FormButton = ({buttonTitle, ...rest}: FormButtonProps) => {
    return (
        <TouchableOpacity style={styles.buttonContainer} {...rest} >
            <Text style={styles.textButton}>{buttonTitle}</Text>
        </TouchableOpacity>
    )
}

export default FormButton

const styles = StyleSheet.create({
    buttonContainer: {
        padding: SIZES.padding,
        backgroundColor: COLORS.blue,
        marginTop: SIZES.padding,
        alignItems: 'center',
        borderRadius: SIZES.base
    },
    textButton: {
        color: COLORS.white, 
        fontWeight: 'bold', 
        ...FONTS.body3
    }
})