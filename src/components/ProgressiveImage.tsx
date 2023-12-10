import { Animated, StyleSheet, View } from "react-native"

const ProgressiveImage = (props) => {
    const defaultImageAnimated = new Animated.Value(0)
    const imageAnimated = new Animated.Value(0)
    const { defaultImageSource, source, style, ...rest } = props

    function handleDefaultImageLoad() {
        Animated.timing(defaultImageAnimated, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    }

    function handleImageLoad() {
        Animated.timing(imageAnimated, {
            toValue: 1,
            useNativeDriver: true
        }).start();
    }

    return (
        <View>
            <Animated.Image
                {...props}
                source={defaultImageSource}
                style={[style, { opacity: defaultImageAnimated }, styles.imageOverlay]}
                onLoad={handleDefaultImageLoad}
                blurRadius={1}
            />
            <Animated.Image
                {...props}
                source={source}
                style={[style, { opacity: imageAnimated }]}
                onLoad={handleImageLoad}
            />
        </View>
    )
}

export default ProgressiveImage

const styles = StyleSheet.create({
    imageOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    }
})