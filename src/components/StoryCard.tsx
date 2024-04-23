import { Image, ImageSourcePropType, StyleSheet, TouchableOpacity } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

import { COLORS } from '../constants'

interface Props {
    storySource: ImageSourcePropType,
    avatarSource: ImageSourcePropType,
    onPress: () => void
}

const StoryCard = (Props: Props) => {

    const { storySource, avatarSource, onPress } = Props
    return (
        <TouchableOpacity style={{ flex: 1 }} onPress={onPress}>
            <Image source={storySource} style={styles.storyStyle} />
            <LinearGradient colors={[COLORS.gradient[0], COLORS.gradient[1]]} style={styles.avatarStyle}>
                <Image source={avatarSource} style={styles.avatarStyle1} />
            </LinearGradient>
        </TouchableOpacity>
    )
}

export default StoryCard

const styles = StyleSheet.create({
    storyStyle: {
        width: 100,
        height: 140,
        flex: 1,
        borderRadius: 16,
    },

    avatarStyle: {
        borderRadius: 50,
        width: 45,
        height: 45,
        position: 'absolute',
        bottom: 5,
        alignSelf: 'center',
    },

    avatarStyle1: {
        borderRadius: 40,
        width: 40,
        position: 'absolute',
        height: 40,
        bottom: 2.5,
        alignSelf: 'center',
        justifyContent: 'center',
        borderColor: COLORS.darkBlack,
        borderWidth: 3
    }
})