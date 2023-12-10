import React from 'react'
import { Text, TouchableOpacity, View, StyleSheet, TouchableOpacityProps } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { FONTS, SIZES } from '../constants'

interface Props {
    buttonTitle: string,
    btnType: string,
    color: string,
    backgroundColor: string
}

type SocialButtonProps = TouchableOpacityProps & Props

const SocialButton = ({
    buttonTitle,
    btnType,
    color,
    backgroundColor,
    ...rest
}: SocialButtonProps) => {

    let bgColor = backgroundColor

    return (
        <TouchableOpacity
            style={[styles.buttonContainer, { backgroundColor: bgColor }]}
            {...rest}>
            <View style={styles.iconWrapper}>
                <FontAwesome name={btnType} style={styles.icon} size={SIZES.icon} color={color} />
            </View>
            <View style={styles.btnTxtWrapper}>
                <Text style={[styles.buttonText, { color: color }]}>{buttonTitle}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default SocialButton

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SIZES.padding,
        marginTop: SIZES.padding,
        borderRadius: SIZES.base
    },
    iconWrapper: {
        flex: 1,
        alignItems: 'center'
    },
    icon: {
        
    },
    btnTxtWrapper: {
        flex: 8,
        alignItems: 'center'
    },
    buttonText: {
        ...FONTS.body3
    },
});