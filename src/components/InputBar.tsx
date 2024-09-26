import { memo, forwardRef, useState } from 'react'
import { StyleProp, StyleSheet, TextInput, TextInputProps, TouchableOpacity, View, ViewStyle } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

import { COLORS, SIZES } from '../constants'
import { UtilIcons } from '../utils/icons'

interface Props extends TextInputProps {
    placeholder?: string,
    value?: string,
    onChangeText?: (text: string) => void,
    mainButton?: any,
    options?: any,
    containerStyle?: StyleProp<ViewStyle>
    onPressMainButton?: () => void,
}

const InputBar = ({ placeholder, value, onChangeText, mainButton, options, containerStyle, onPressMainButton, ...rest }: Props, ref: any) => {
    const [focusInput, setFocusInput] = useState(false)

    return (
        <View>
            <View style={[styles.inputContainer, containerStyle]}>
                <TextInput
                    ref={ref}
                    onFocus={() => setFocusInput(true)}
                    onBlur={() => setFocusInput(false)}
                    style={[styles.textInput, { width: options ? '79%' : '90%' }]}
                    placeholder={placeholder}
                    placeholderTextColor={COLORS.socialWhite}
                    value={value}
                    onChangeText={onChangeText}
                    multiline
                    {...rest}
                />
                {options && !focusInput ? (
                    <TouchableOpacity style={styles.buttonAdd}>
                        <UtilIcons.svgPlus color={COLORS.lightGrey} />
                    </TouchableOpacity>
                ) : <></>}

                {mainButton ? mainButton : (
                    <TouchableOpacity onPress={onPressMainButton}>
                        <LinearGradient colors={[COLORS.gradient[0], COLORS.gradient[1]]} style={styles.buttonSend}>
                            <UtilIcons.svgSend color={COLORS.socialWhite} />
                        </LinearGradient>
                    </TouchableOpacity>
                )}
            </View>

            {options && focusInput ? (
                options()
            ) : <></>}
        </View>


    )
}

export default memo(forwardRef(InputBar))

const styles = StyleSheet.create({
    inputContainer: {
        backgroundColor: COLORS.darkGrey,
        borderRadius: 32,
        paddingHorizontal: SIZES.padding,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: SIZES.padding,
    },

    textInput: {
        color: COLORS.socialWhite,
    },

    buttonSend: {
        width: 32,
        height: 32,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },

    buttonAdd: {
        paddingRight: SIZES.padding
    }
})