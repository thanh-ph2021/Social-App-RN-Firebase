import { memo } from "react"
import { useDerivedValue, withTiming } from "react-native-reanimated"
import Svg from "react-native-svg"

import AnimatedColor from "./AnimatedColor"
import CheckMark from "./CheckMark"

type Props = {
    checked: boolean,
    size: number,
    checkedMarkColor: string,
    checkedBackgroundColor: string,
    unCheckedBackgroundColor: string,
}

const Checkbox = (props: Props) => {
    const { checked, size, checkedMarkColor, checkedBackgroundColor, unCheckedBackgroundColor, } = props

    const progress = useDerivedValue(() => {
        return withTiming(checked ? 1 : 0)
    })

    return (
        <Svg width={size} height={size} viewBox="0 0 45 45" fill="none">
            <AnimatedColor progress={progress} checkedBackgroundColor={checkedBackgroundColor} unCheckedBackgroundColor={unCheckedBackgroundColor} />
            <CheckMark progress={progress} checkedMarkColor={checkedMarkColor} />
        </Svg>
    )
}

export default memo(Checkbox)