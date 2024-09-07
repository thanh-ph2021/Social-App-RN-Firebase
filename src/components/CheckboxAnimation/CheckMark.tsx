import { memo, useState, useRef } from "react"
import Animated, { useAnimatedProps } from "react-native-reanimated"

import { Path } from "react-native-svg"

type Props = {
    progress: any,
    checkedMarkColor: string,
}

const AnimatedPath = Animated.createAnimatedComponent(Path)


const CheckMark = (props: Props) => {
    const { progress, checkedMarkColor } = props
    const [length, setLength] = useState(0)
    const pathRef = useRef<any>(null)


    const animation = useAnimatedProps(() => {
        const strokeDashoffset = length - length * progress.value
        const opacity = progress.value

        return { opacity, strokeDashoffset }
    })

    return (
        <AnimatedPath
            animatedProps={animation}
            onLayout={() => setLength(pathRef.current.getTotalLength())}
            ref={pathRef}
            d="M11 21.5L20 31L34.5 14"
            stroke={checkedMarkColor}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={length}
        />
    )
}

export default memo(CheckMark)