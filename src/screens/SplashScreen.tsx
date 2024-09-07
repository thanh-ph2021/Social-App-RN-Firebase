import { ImageBackground, StatusBar } from "react-native"
import { images } from '../constants'

const SplashScreen = () => {
    return (
        <>
            <StatusBar hidden />
            <ImageBackground source={images.splashScreen} resizeMode="cover" style={{ flex: 1 }} />
        </>
    )

}

export default SplashScreen