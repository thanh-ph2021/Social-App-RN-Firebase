import { View } from "react-native"
import AnimatedLoader from "react-native-animated-loader"

import { COLORS } from "../constants"

const Loader = () => {
    return (
        <View style={{}}>
            <AnimatedLoader
                visible={true}
                overlayColor={COLORS.darkBlack}
                source={require("../assets/animations/loader.json")}
                animationStyle={{width: 300, height: 300}}
                speed={1}
            />
        </View>
    )
}

export default Loader