import { useEffect, useState } from 'react'
import { snapPoint } from 'react-native-redash'
import { ImageRequireSource, Modal, StyleSheet, TouchableOpacity, View } from 'react-native'
import { FlatList, Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler'
import FastImage, { Source } from 'react-native-fast-image'
import Animated, { Extrapolation, interpolate, runOnJS, useAnimatedStyle, useSharedValue, withTiming, ZoomIn } from 'react-native-reanimated'

import { SIZES, FONTS, COLORS } from '../constants'
import { getHitSlop, getImageSize } from '../utils'
import { UtilIcons } from '../utils/icons'
import TextComponent from './TextComponent'
import { utilStyles } from '../styles'

const SNAP_POINTS = [-SIZES.height, 0, SIZES.height]

export type ImageType = {
    source: Source | ImageRequireSource,
    width?: number,
    height?: number
}

interface LightBoxProps {
    visible: boolean,
    onRequestClose: () => void,
    sources: ImageType[]
}

const LightBox = ({ visible, onRequestClose, sources }: LightBoxProps) => {
    const scale = useSharedValue(1)
    const translateY = useSharedValue(0)
    const focalX = useSharedValue(0)
    const focalY = useSharedValue(0)

    const [activeIndex, setActiveIndex] = useState(0)

    const [images, setImages] = useState<ImageType[]>(sources)

    useEffect(() => {
        const fetchSizes = async () => {
            try {
                const updateImages = await Promise.all(
                    sources.map(async (item) => {
                        const { width: imgWidth, height: imgHeight } = await getImageSize(item.source)
                        const ratio = SIZES.width / imgWidth
                        return {
                            ...item,
                            width: SIZES.width,
                            height: ratio * imgHeight
                        }
                    })

                )
                setImages(updateImages)
            } catch (error) {
                console.log("🚀 ~ fetchSizes ~ error:", error)
            }
        }

        fetchSizes()
        setActiveIndex(0)

    }, [sources])

    const onClose = () => {
        translateY.value = withTiming(0)
        scale.value = withTiming(1)
        onRequestClose()
    }

    const pinGesture = Gesture.Pinch()
        .onUpdate((e) => {
            scale.value = e.scale
            focalX.value = e.focalX
            focalY.value = e.focalY
        })
        .onEnd(() => {
            scale.value = withTiming(1)
        })

    const panGesture = Gesture.Pan()
        .onUpdate((e) => {
            translateY.value = e.translationY
        })
        .onEnd((e) => {
            const dest = snapPoint(translateY.value, e.velocityY, SNAP_POINTS)
            translateY.value = withTiming(dest, {}, () => {
                if (dest !== 0) {
                    runOnJS(onClose)()
                }
            })
        })
        .maxPointers(1)

    const composed = Gesture.Simultaneous(panGesture, pinGesture)

    const backdropStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
            translateY.value,
            [-SIZES.height, 0, SIZES.height],
            [1 + translateY.value / SIZES.height, 1, 1 - translateY.value / SIZES.height],
            Extrapolation.CLAMP,
        ),
    }))

    const imageAnimatedStyle = useAnimatedStyle(() => {
        const value = interpolate(
            translateY.value,
            [-SIZES.height, 0, SIZES.height],
            [0, 1, 0],
            Extrapolation.CLAMP,
        )
        return {
            transform: [
                { translateY: translateY.value },
                { translateX: focalX.value },
                { translateY: focalY.value },
                { translateX: -SIZES.width / 2 },
                { translateY: -SIZES.height / 2 },
                { scale: scale.value },
                { translateX: -focalX.value },
                { translateY: -focalY.value },
                { translateX: SIZES.width / 2 },
                { translateY: SIZES.height / 2 },
                { scale: value },
            ],
            opacity: value,
        }
    })

    return (
        <View style={utilStyles.container}>
            <Modal
                statusBarTranslucent
                transparent
                animationType='none'
                visible={visible}
            >
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <Animated.View style={[styles.backdrop, backdropStyle]}>
                        <Animated.View
                            entering={ZoomIn}
                            style={{ position: 'absolute', top: 40, right: 15, zIndex: 3, backgroundColor: COLORS.grey5205, borderRadius: SIZES.radius }}
                        >
                            <TouchableOpacity
                                hitSlop={getHitSlop(20)}
                                onPress={() => onClose()}
                                style={{ flexDirection: 'row', alignItems: 'center', padding: SIZES.base }}
                            >
                                {sources.length > 1 && <TextComponent
                                    text={`${activeIndex + 1}/${sources.length}`}
                                    style={{ ...FONTS.h3, paddingRight: SIZES.padding }}
                                />}
                                <UtilIcons.svgClose size={30} color={COLORS.socialWhite} />
                            </TouchableOpacity>
                        </Animated.View>
                        <GestureDetector gesture={composed}>
                            <FlatList
                                horizontal
                                pagingEnabled
                                data={images}
                                onMomentumScrollEnd={(e) => {
                                    const index = Math.floor(e.nativeEvent.contentOffset.x / SIZES.width)
                                    setActiveIndex(index)
                                }}
                                renderItem={({ item, index }) => {
                                    return (
                                        <Animated.View style={[styles.imageContainer, imageAnimatedStyle]} key={index}>
                                            <Animated.View entering={ZoomIn}>
                                                <FastImage
                                                    style={{ width: item.width, height: item.height }}
                                                    source={item.source}
                                                    resizeMode='contain'
                                                />
                                            </Animated.View>
                                        </Animated.View>
                                    )
                                }}
                            />
                        </GestureDetector>
                    </Animated.View>
                </GestureHandlerRootView>
            </Modal>
        </View>
    )
}

export default LightBox

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1,
        backgroundColor: 'black',
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2
    }
})