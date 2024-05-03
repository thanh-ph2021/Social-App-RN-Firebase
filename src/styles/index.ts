import { StyleSheet } from 'react-native'
import { FONTS, COLORS } from '../constants'

export const utilStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.darkBlack
    },

    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: COLORS.socialWhite,
    },

    avatar: {
        width: 50,
        height: 50,
        borderRadius: 60,
    },

    image: {
        width: '100%',
        height: 250,
    },

    iconEmotion: {
        width: 20,
        height: 20,
        marginRight: -5
    },
    button: {
        flexDirection: 'row',
        alignSelf: 'center',
    },

    buttonText: {
        ...FONTS.body4,
        color: COLORS.socialWhite
    },

    text: {
        fontSize: 14,
        color: COLORS.text
    },
})



