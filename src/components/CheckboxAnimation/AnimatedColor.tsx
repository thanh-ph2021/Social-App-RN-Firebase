import { memo } from "react"
import Animated, { useAnimatedProps, interpolateColor, SharedValue, createAnimatedPropAdapter, processColor } from "react-native-reanimated"
import { Rect } from "react-native-svg"

type Props = {
    progress: SharedValue<number>,
    checkedBackgroundColor: string,
    unCheckedBackgroundColor: string,
}

export const adapter = createAnimatedPropAdapter(
    (props) => {
        if (Object.keys(props).includes('fill')) {
            props.fill = { type: 0, payload: processColor(props.fill) }
        }
    },
    ['fill']
)

const AnimatedRect = Animated.createAnimatedComponent(Rect)

const AnimatedColor = (props: Props) => {
    const { progress, checkedBackgroundColor, unCheckedBackgroundColor } = props

    // thêm adapter fix error 
    // ReanimatedError: Exception in HostFunction: java.lang.ClassCastException: java.lang.Double cannot be cast to com.facebook.react.bridge.ReadableMap, js engine: reanimated
    const animation = useAnimatedProps(() => {
        const fill = interpolateColor(
            progress.value,
            [0, 1],
            [unCheckedBackgroundColor, checkedBackgroundColor]
        )

        return { fill }
    }, [], adapter)

    return (
        <AnimatedRect animatedProps={animation} x="1.5" y="1.5" width="42" height="42" rx="12.5" stroke="#F62E8E" strokeWidth="3" />
    )
}

export default memo(AnimatedColor)