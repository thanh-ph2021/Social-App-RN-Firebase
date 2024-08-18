import { View } from "react-native"

import { COLORS, SIZES } from "../constants"

interface Props {
    height?: number,
    color?: string
}

const Divider = (props: Props) => {

    const { height, color } = props
    return (
        <View style={{ height: height ? height : 2, backgroundColor: color ? color : COLORS.darkGrey, alignItems: 'center', marginVertical: SIZES.base }} />
    )
}

export default Divider