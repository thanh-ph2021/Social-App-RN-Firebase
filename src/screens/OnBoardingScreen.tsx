import React, { useRef } from 'react'
import { View, Image, StyleSheet, StatusBar, FlatList } from 'react-native'
import Animated, { SharedValue, useAnimatedRef, useAnimatedScrollHandler, useSharedValue, useAnimatedStyle, interpolate, Extrapolation } from 'react-native-reanimated'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { images, FONTS, COLORS, SIZES } from '../constants'
import { CustomButton, Indicator, TextComponent } from '../components'
import { OnboardingData } from '../models'

const data = [
    {
        key: '1',
        image: images.OnBoarding01,
        title: 'Share moments and documents anytime, anywhere.',
    },
    {
        key: '2',
        image: images.OnBoarding02,
        title: 'Customize your profile to express your own style.',
    },
    {
        key: '3',
        image: images.OnBoarding03,
        title: 'Connect and chat with friends easily.',
    },
]

const RenderItem = ({ item, index, x }: { item: OnboardingData, index: number, x: SharedValue<number> }) => {

    const imageAnimatedStyle = useAnimatedStyle(() => {
        const translateYAnimation = interpolate(
            x.value,
            [
                (index - 1) * SIZES.width,
                index * SIZES.width,
                (index + 1) * SIZES.width
            ],
            [200, 0, -200],
            Extrapolation.CLAMP
        )
        return {
            transform: [{ translateY: translateYAnimation }]
        }
    })
    return (
        <View style={{
            width: SIZES.width,
            alignItems: 'center',
            padding: 20
        }}>
            <View style={{
                flex: 0.7,
                justifyContent: 'center'
            }}>
                <Animated.Image
                    source={item.image}
                    style={[
                        {
                            width: SIZES.width / 2,
                            height: SIZES.width / 2,
                            resizeMode: 'contain'
                        },
                        imageAnimatedStyle
                    ]}
                />
            </View>
            <View style={{ flex: 0.3 }}>
                <TextComponent text={item.title} style={{ ...FONTS.h2, textAlign: 'center' }} color={COLORS.socialWhite} />
            </View>
        </View>
    )
}

const OnBoardingScreen = ({ navigation }: NativeStackScreenProps<any>) => {

    const x = useSharedValue(0)
    const flatListRef = useAnimatedRef<FlatList<OnboardingData>>()
    const flatListIndex = useSharedValue(0)

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems && viewableItems[0] && viewableItems[0].index !== null) {
            flatListIndex.value = viewableItems[0].index
        }
    })

    const onScroll = useAnimatedScrollHandler({
        onScroll: event => {
            x.value = event.contentOffset.x
        }
    })

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.darkBlack, justifyContent: 'center', alignItems: 'center' }}>
            <StatusBar hidden />
            <Animated.FlatList
                ref={flatListRef}
                data={data}
                keyExtractor={item => item.key}
                horizontal
                scrollEventThrottle={16}
                onScroll={onScroll}
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                bounces={false}
                onViewableItemsChanged={onViewableItemsChanged.current}
                viewabilityConfig={{
                    minimumViewTime: 300,
                    viewAreaCoveragePercentThreshold: 10
                }}
                renderItem={({ item, index }) => {
                    return (
                        <RenderItem item={item} index={index} x={x} />
                    )
                }}
            />
            <View style={{
                position: 'absolute',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                bottom: 20,
                padding: 20
            }}>
                <Indicator x={x} data={data} />
                <CustomButton
                    flatListRef={flatListRef}
                    flatListIndex={flatListIndex}
                    dataLength={data.length}
                    x={x}
                    gotoLogin={() => navigation.replace('Login')}
                />
            </View>

        </View>

    )
}

const styles = StyleSheet.create({
    imageStyle: {
        width: 300,
        height: 300
    },
})

export default OnBoardingScreen