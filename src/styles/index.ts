import { StyleSheet } from 'react-native'

import { FONTS, COLORS, SIZES } from '../constants'

export const utilStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.darkBlack
    },

    containerBackground: {
        flex: 1,
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

    avatarStyle: {
        width: 120,
        height: 120,
        borderRadius: SIZES.width / 0.25,
        alignSelf: 'center',
        marginTop: -50,
    },

    image: {
        width: 115,
        height: 115,
        borderRadius: SIZES.width / 0.25,
        alignSelf: 'center',
        justifyContent: 'center',
        borderColor: COLORS.darkBlack,
        borderWidth: 3,
        marginTop: 2.5,
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

    btnHeaderLeft: {
        width: 32,
        height: 32,
        borderRadius: 20,
        borderColor: COLORS.lightGrey,
        borderWidth: 1,
        marginHorizontal: SIZES.padding,
        alignItems: 'center',
        justifyContent: 'center'
    },

    video: {
        width: '100%',
        aspectRatio: 16 / 9,
    }
})



