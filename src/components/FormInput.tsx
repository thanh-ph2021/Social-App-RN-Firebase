import { View, TextInput, StyleSheet, TextInputProps, StyleProp, ViewStyle } from "react-native"

import { COLORS, SIZES, FONTS } from "../constants"
import TextComponent from "./TextComponent";

interface Props {
    labelValue: string,
    placeholderText: string,
    iconType?: string,
    containerStyle?: StyleProp<ViewStyle>,
    inputContainerStyle?: StyleProp<ViewStyle>,
    inputStyle?: any,
    title?: string
}

type FormInputProps = TextInputProps & Props;

const FormInput = ({ labelValue, placeholderText, iconType, containerStyle, inputContainerStyle, inputStyle, title, ...rest }: FormInputProps) => {
    return (
        <View style={[styles.container, containerStyle]}>
            {title && <TextComponent text={title} color={COLORS.lightGrey} style={{ paddingBottom: SIZES.base }} />}
            <View style={[styles.inputContainer, inputContainerStyle]}>
                <TextInput
                    style={[styles.inputField, { ...inputStyle }]}
                    value={labelValue}
                    placeholder={placeholderText}
                    placeholderTextColor={COLORS.lightGrey}
                    {...rest}
                />
            </View>
        </View>
    )
}

export default FormInput

const styles = StyleSheet.create({
    container: {
        padding: SIZES.base,
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: SIZES.base,
        borderWidth: 1,
    },

    inputField: {
        flex: 1,
        borderColor: COLORS.socialWhite,
        textAlignVertical: "top",
        padding: SIZES.padding,
        color: COLORS.socialWhite,
        ...FONTS.body3
    },
})