import { FlatList, TouchableWithoutFeedback, View } from "react-native"
import Animated, { AnimatedRef, SharedValue, useAnimatedStyle, withSpring, withTiming } from "react-native-reanimated"

import { COLORS, FONTS } from "../../constants"
import { UtilIcons } from "../../utils/icons"
import { OnboardingData } from "../../models"

type Props = {
    dataLength: number,
    flatListIndex: SharedValue<number>,
    flatListRef: AnimatedRef<FlatList<OnboardingData>>
    x: SharedValue<number>,
    gotoLogin: () => void
}

const CustomButton = ({ dataLength, flatListIndex, flatListRef, x, gotoLogin }: Props) => {

    const buttonAnimationStyle = useAnimatedStyle(() => {
        return {
            width: flatListIndex.value === dataLength - 1 ? withSpring(140) : withSpring(60),
            height: 60
        }
    })

    const arrowAnimationStyle = useAnimatedStyle(() => {
        return {
            opacity: flatListIndex.value === dataLength - 1 ? withTiming(0) : withTiming(1),
            transform: [
                {
                    translateX: flatListIndex.value === dataLength - 1 ? withTiming(100) : withTiming(0)
                }
            ]
        }
    })

    const textAnimationStyle = useAnimatedStyle(() => {
        return {
            opacity: flatListIndex.value === dataLength - 1 ? withTiming(1) : withTiming(0),
            transform: [
                {
                    translateX: flatListIndex.value === dataLength - 1 ? withTiming(0) : withTiming(-100)
                }
            ]
        }
    })

    return (
        <TouchableWithoutFeedback
            onPress={() => {
                if (flatListIndex.value < dataLength - 1) {
                    flatListRef.current?.scrollToIndex({ index: flatListIndex.value + 1 })
                } else {
                    gotoLogin()
                }
            }}
        >
            <Animated.View style={[
                {
                    width: 50,
                    height: 50,
                    padding: 10,
                    borderRadius: 50,
                    backgroundColor: COLORS.socialPink,
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden'
                },
                buttonAnimationStyle
            ]}>
                <Animated.Text style={[{ position: "absolute", color: COLORS.socialWhite, ...FONTS.h3 }, textAnimationStyle]}>Get Started</Animated.Text>
                <Animated.View style={arrowAnimationStyle}>
                    <UtilIcons.svgArrowRight size={25} color={COLORS.socialWhite} />
                </Animated.View>
            </Animated.View>

        </TouchableWithoutFeedback>
    )
}

export default CustomButton