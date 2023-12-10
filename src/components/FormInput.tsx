import { View, TextInput, StyleSheet, TextInputProps } from "react-native"
import { COLORS, SIZES, FONTS } from "../constants"
import Feather from 'react-native-vector-icons/Feather'

interface Props {
    labelValue: string,
    placeholderText: string,
    iconType: string,
    containerStyle?: any,
    inputStyle?: any
}

type FormInputProps = TextInputProps & Props;

const FormInput = ({ labelValue, placeholderText, iconType, containerStyle, inputStyle, ...rest }: FormInputProps) => {
    return (
        <View style={[styles.inputContainer, { ...containerStyle }]}>
            <View style={styles.iconStyle}>
                <Feather name={iconType} size={SIZES.icon} color='#666' />
            </View>
            <TextInput
                style={[styles.inputField, { ...inputStyle }]}
                value={labelValue}
                placeholder={placeholderText}
                placeholderTextColor='#666'
                {...rest}
            />
        </View>
    )
}

export default FormInput

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: SIZES.base,
        borderWidth: 1,
        borderColor: COLORS.gray,
        marginTop: SIZES.padding
    },
    iconStyle: {
        alignSelf: 'center',
        padding: SIZES.padding,
    },
    inputField: {
        borderLeftWidth: 1,
        borderColor: COLORS.gray,
        flex: 1,
        padding: SIZES.padding,
        ...FONTS.body3
    },
})