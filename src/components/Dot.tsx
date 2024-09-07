import Animated, { Extrapolation, interpolate, SharedValue, useAnimatedProps } from "react-native-reanimated"

import { COLORS, SIZES } from "../constants"

type Props = {
    index: number,
    x: SharedValue<number>
}

const Dot = ({ index, x }: Props) => {
    
    const animatedDotStyle = useAnimatedProps(() => {
        const inputRange = [(index - 1) * SIZES.width, index * SIZES.width, (index + 1) * SIZES.width]
        const widthAnimation = interpolate(
            x.value,
            inputRange,
            [10, 20, 10],
            Extrapolation.CLAMP
        )
        const opacityAnimation = interpolate(
            x.value,
            inputRange,
            [0.6, 0.9, 0.6],
            Extrapolation.CLAMP
        )
        return {
            width: widthAnimation,
            opacity: opacityAnimation,
        }
    })

    return (
        <Animated.View
            style={[
                {
                    height: 10,
                    width: 10,
                    borderRadius: 5,
                    backgroundColor: COLORS.socialWhite,
                    margin: 10,
                },
                animatedDotStyle
            ]}
        />
    )
}

export default Dot