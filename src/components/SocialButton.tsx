import React from 'react'
import { Text, TouchableOpacity, View, StyleSheet, TouchableOpacityProps, Image } from 'react-native'
import { FONTS, SIZES } from '../constants'

interface Props {
    buttonTitle?: string,
    image: any,
    imageSize: number,
    color?: string,
    backgroundColor?: string
}

type SocialButtonProps = TouchableOpacityProps & Props

const SocialButton = ({
    buttonTitle,
    image,
    imageSize,
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
                <Image
                    source={image}
                    style={{ width: imageSize, height: imageSize }}
                />
            </View>
            {buttonTitle ? <View style={styles.btnTxtWrapper}>
                <Text style={[styles.buttonText, { color: color }]}>{buttonTitle}</Text>
            </View> : <></>}
        </TouchableOpacity>
    );
};

export default SocialButton

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SIZES.base,
        marginTop: SIZES.padding,
        borderRadius: SIZES.base,
        width: 50,
        height: 40
    },
    iconWrapper: {
        flex: 1,
        alignItems: 'center'
    },
    btnTxtWrapper: {
        flex: 8,
        alignItems: 'center'
    },
    buttonText: {
        ...FONTS.body3
    },
});