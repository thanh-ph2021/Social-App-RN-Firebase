import { useEffect, useState } from 'react'
import { View, TouchableOpacity, StyleSheet, StatusBar, Image, TextInput, Pressable } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import moment from 'moment'
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, useAnimatedReaction, runOnJS} from 'react-native-reanimated'

import { COLORS, SIZES } from '../constants'
import { TextComponent } from '../components'
import { UtilIcons } from '../utils/icons'

const storyUsers = [
    {
        userID: 1,
        userName: 'holy di',
        avatar: 'https://firebasestorage.googleapis.com/v0/b/the-shop-app-c11c1.appspot.com/o/photos%2F0b303b34-fb2d-4e71-9f9e-819b503d8165.jpg?alt=media&token=d34ad32f-d7db-4f04-be46-18f1a6ab2503',
        storyDatas: [
            {
                uri: 'https://firebasestorage.googleapis.com/v0/b/the-shop-app-c11c1.appspot.com/o/photos%2F6178e5af-42d1-4ea5-b66d-1c9b7bda78c8.jpg?alt=media&token=37da67f0-cede-47c0-b1dc-bb8f27a67acd',
                date: new Date()
            },
            {
                uri: 'https://firebasestorage.googleapis.com/v0/b/the-shop-app-c11c1.appspot.com/o/photos%2F7c0f1996-e4df-4980-ac56-620741c2b11d.jpg?alt=media&token=0373e13c-53bf-4da9-bf26-d62fb893cfe7',
                date: new Date()
            },
            {
                uri: 'https://firebasestorage.googleapis.com/v0/b/the-shop-app-c11c1.appspot.com/o/photos%2F742cda60-4d18-42b7-9263-a9f7dc6917f0.jpg?alt=media&token=af600724-e546-4d91-ba96-a76900fd9a4c',
                date: new Date()
            }
        ]
    },
    {
        userID: 2,
        userName: 'steve john',
        avatar: 'https://firebasestorage.googleapis.com/v0/b/the-shop-app-c11c1.appspot.com/o/photos%2FIMG20231119100018.jpg?alt=media&token=195aa374-d7a6-4e41-8cd8-ec277efa5440',
        storyDatas: [
            {
                uri: 'https://firebasestorage.googleapis.com/v0/b/the-shop-app-c11c1.appspot.com/o/photos%2Fgold-sunset-over-foggy-forest-hdr-matra-mountains-hungary-imagr-black-filter-83343247.jpg?alt=media&token=449575c1-e637-4f35-97e7-4122a0b5caf0',
                date: new Date()
            },
            {
                uri: 'https://firebasestorage.googleapis.com/v0/b/the-shop-app-c11c1.appspot.com/o/photos%2F7c0f1996-e4df-4980-ac56-620741c2b11d.jpg?alt=media&token=0373e13c-53bf-4da9-bf26-d62fb893cfe7',
                date: new Date()
            },
            {
                uri: 'https://firebasestorage.googleapis.com/v0/b/the-shop-app-c11c1.appspot.com/o/photos%2F742cda60-4d18-42b7-9263-a9f7dc6917f0.jpg?alt=media&token=af600724-e546-4d91-ba96-a76900fd9a4c',
                date: new Date()
            }
        ]
    },
    {
        userID: 3,
        userName: 'ho hy',
        avatar: 'https://firebasestorage.googleapis.com/v0/b/the-shop-app-c11c1.appspot.com/o/photos%2Fflowers-19830_1280.jpg?alt=media&token=be7702c1-fe88-420d-af09-173fe15b78b9',
        storyDatas: [
            {
                uri: 'https://firebasestorage.googleapis.com/v0/b/the-shop-app-c11c1.appspot.com/o/photos%2F6178e5af-42d1-4ea5-b66d-1c9b7bda78c8.jpg?alt=media&token=37da67f0-cede-47c0-b1dc-bb8f27a67acd',
                date: new Date()
            },
            {
                uri: 'https://firebasestorage.googleapis.com/v0/b/the-shop-app-c11c1.appspot.com/o/photos%2F7c0f1996-e4df-4980-ac56-620741c2b11d.jpg?alt=media&token=0373e13c-53bf-4da9-bf26-d62fb893cfe7',
                date: new Date()
            },
            {
                uri: 'https://firebasestorage.googleapis.com/v0/b/the-shop-app-c11c1.appspot.com/o/photos%2F742cda60-4d18-42b7-9263-a9f7dc6917f0.jpg?alt=media&token=af600724-e546-4d91-ba96-a76900fd9a4c',
                date: new Date()
            }
        ]
    },

]

const durationProgress = 5 * 1000

const StoryScreen = () => {

    const [userIndex, setUserIndex] = useState(0)
    const [storyIndex, setStoryIndex] = useState<number>(0)

    const user = storyUsers[userIndex]
    const story = user.storyDatas[storyIndex]

    const progress = useSharedValue(0)

    useEffect(() => {
        progress.value = 0
        progress.value = withTiming(1, { duration: durationProgress, easing: Easing.linear })
    }, [storyIndex, userIndex])

    const indicatorAnimatedStyle = useAnimatedStyle(() => ({
        width: `${progress.value * 100}%`
    }))

    const goToNextStory = () => {
        setStoryIndex(index => {
            if (storyIndex == user.storyDatas.length - 1) {
                goToNextUser()
                return 0
            } else {
                return index + 1
            }
        })
    }

    const goToPrevStory = () => {
        setStoryIndex(index => {
            if (storyIndex == 0) {
                goToPrevUser()
                return 0
            } else {
                return index - 1
            }
        })
    }

    const goToNextUser = () => {
        setUserIndex(index => {
            if (index == storyUsers.length - 1) {
                return 0
            } else {
                return index + 1
            }
        })
    }

    const goToPrevUser = () => {
        setUserIndex(index => {
            if (index == 0) {
                return storyUsers.length - 1
            } else {
                return index - 1
            }
        })
    }

    useAnimatedReaction(
        () => {
          return progress.value;
        },
        (currentValue, previousValue) => {
          if (currentValue !== previousValue && currentValue === 1) {
            'worklet'
            runOnJS(goToNextStory)()
          }
        }
      );

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={'transparent'} translucent />
            <Image source={{ uri: story.uri }} style={styles.story} />
            
            {/* header */}
            <LinearGradient
                colors={['rgba(0, 0, 0, 0.5)', 'transparent']}
                style={styles.header}
            >
                {/* indicator bar */}
                <View style={styles.indicatorContainer}>
                    {user.storyDatas.map((story, index) => {
                        return (
                            <View key={story.uri+index} style={[styles.indicatorShadow, index < storyIndex && { backgroundColor: COLORS.socialWhite}]}>
                                <Animated.View style={[
                                    styles.indicatorBar,
                                    index == storyIndex && indicatorAnimatedStyle,
                                    index > storyIndex && { backgroundColor: COLORS.darkGrey },
                                    
                                ]} />
                            </View>

                        )
                    })}
                </View>
                {/* user */}
                <View style={{ flexDirection: 'row' }}>
                    <LinearGradient colors={[COLORS.gradient[0], COLORS.gradient[1]]} style={styles.avatarStyle}>
                        <Image source={{ uri: user.avatar }} style={styles.avatarStyle1} />
                    </LinearGradient>
                    <View style={styles.textWrap}>
                        <TextComponent text={user.userName} style={{ fontWeight: 'bold' }} />
                        <TextComponent text={moment(story.date).fromNow()} />
                    </View>
                </View>
            </LinearGradient>

            {/* footer */}
            <View style={styles.footer}>
                <View style={styles.inputContainer}>
                    <TextInput style={styles.textInput} placeholder='Type your reply here...' placeholderTextColor={COLORS.socialWhite} />
                    <TouchableOpacity>
                        <LinearGradient colors={[COLORS.gradient[0], COLORS.gradient[1]]} style={styles.buttonSend}>
                            <UtilIcons.svgSend color={COLORS.socialWhite} />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>

            {/* button prev story */}
            <Pressable style={styles.buttonPrevStory} onPress={goToPrevStory} />
            {/* button next to story */}
            <Pressable style={[styles.buttonPrevStory, { right: 0 }]} onPress={goToNextStory} />
        </View>
    )
}

export default StoryScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.darkBlack,
        flex: 1,
    },

    story: {
        width: '100%',
        height: '100%'
    },

    header: {
        width: '100%',
        position: 'absolute',
        top: 0,
        padding: SIZES.padding + SIZES.base,
    },

    footer: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        width: '100%',
        height: 88,
    },

    inputContainer: {
        backgroundColor: COLORS.darkGrey,
        borderRadius: 32,
        margin: SIZES.padding,
        paddingHorizontal: SIZES.padding,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    textInput: {
        color: COLORS.socialWhite,
        width: '90%'
    },

    indicatorContainer: {
        flexDirection: 'row',
        gap: 5,
        paddingVertical: SIZES.padding,
    },

    indicatorShadow: {
        flex: 1,
        height: 5,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: COLORS.darkGrey
    },

    indicatorBar: {
        height: '100%',
        backgroundColor: COLORS.socialWhite
    },

    headerShadow: {
        width: '100%',
    },

    textWrap: {
        paddingLeft: SIZES.padding
    },

    buttonPrevStory: {
        position: 'absolute',
        height: '100%',
        width: '40%',
    },

    buttonSend: {
        width: 32,
        height: 32,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },

    avatarStyle: {
        borderRadius: 50,
        width: 45,
        height: 45,
    },

    avatarStyle1: {
        borderRadius: 40,
        width: 40,
        position: 'absolute',
        height: 40,
        bottom: 2.5,
        alignSelf: 'center',
        justifyContent: 'center',
        borderColor: COLORS.darkBlack,
        borderWidth: 3
    }
})