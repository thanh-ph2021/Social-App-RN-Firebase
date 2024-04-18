import { View } from "react-native"
import { COLORS, SIZES } from "../constants"

interface Props {
    height?: number
}

const Divider = (props: Props) => {

    const { height } = props
    return (
        <View style={{ height: height ? height : 2, backgroundColor: COLORS.darkGrey, alignItems: 'center', marginVertical: SIZES.base }} />
    )
}

export default Divider