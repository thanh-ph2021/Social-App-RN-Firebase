import { useEffect, useRef, useState } from 'react'
import { View, TouchableOpacity, StyleSheet, StatusBar, Image, TextInput, Pressable } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import moment from 'moment'
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, useAnimatedReaction, runOnJS } from 'react-native-reanimated'
import uuid from 'react-native-uuid'
import { useRoute } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { COLORS, SIZES } from '../constants'
import { TextComponent } from '../components'
import { UtilIcons } from '../utils/icons'
import { useAppDispatch, useAppSelector } from '../hooks'
import { MediaItem, MessageItemModel } from '../models'
import { sendMessage } from '../redux/actions/message'
import { addChat } from '../redux/actions/chat'
import AppBottomSheet from '../components/AppBottomSheet'
import StoryOption from '../components/StoryOption'

const durationProgress = 5 * 1000

const StoryScreen = ({ navigation }: NativeStackScreenProps<any>) => {

    const route = useRoute<any>()
    const { params } = route

    const [userIndex, setUserIndex] = useState<number>(params.index ?? 0)
    const [storyIndex, setStoryIndex] = useState<number>(0)
    const stories = params.userStories ? params.userStories : useAppSelector(state => state.storyState.stories)
    const dispatch = useAppDispatch()
    const [text, setText] = useState('')
    const currentUser = useAppSelector(state => state.userState.currentUser)
    const optionsStorySheetRef = useRef<any>()
    const [isPaused, setIsPaused] = useState(false)

    const user = stories[userIndex]
    const story = user.data[storyIndex]

    const progress = useSharedValue(0)

    useEffect(() => {
        animationStory()
    }, [storyIndex, userIndex])

    const indicatorAnimatedStyle = useAnimatedStyle(() => ({
        width: `${progress.value * 100}%`
    }))

    const animationStory = () => {
        progress.value = 0
        progress.value = withTiming(1, { duration: durationProgress, easing: Easing.linear })
    }

    const handlePressOptions = () => {
        setIsPaused(true)
        optionsStorySheetRef.current.snapTo(0)
    }

    const goToNextStory = () => {
        setStoryIndex(index => {
            if (index === user.data.length - 1) {
                goToNextUser()
                return 0
            } else {
                return index + 1
            }
        })
    }

    const goToPrevStory = () => {
        setStoryIndex(index => {
            if (index === 0) {
                goToPrevUser()
                return 0
            } else {
                return index - 1
            }
        })
    }

    const goToNextUser = () => {
        setUserIndex(index => {
            if (index === stories.length - 1) {
                return 0
            } else {
                return index + 1
            }
        })
    }

    const goToPrevUser = () => {
        setUserIndex(index => {
            if (index === 0) {
                return stories.length - 1
            } else {
                return index - 1
            }
        })
    }

    useAnimatedReaction(
        () => ({
            progressValue: progress.value,
            paused: isPaused
        }),
        ({ progressValue, paused }, previous) => {
            if (previous && progressValue !== previous.progressValue && progressValue === 1) {
                'worklet'
                runOnJS(goToNextStory)()
            }

            if (previous && paused !== previous.paused && paused) {
                progress.value = progress.value
            }

            if (previous && paused !== previous.paused && !paused) {
                const remainingDuration = durationProgress * (1 - progress.value)
                progress.value = withTiming(1, { duration: remainingDuration, easing: Easing.linear })
            }
        }
    )

    const onSend = async () => {
        setText('')
        dispatch(addChat(user.userId, (chatId: string) => {
            const message: MessageItemModel = {
                _id: uuid.v4().toString(),
                createdAt: new Date(),
                text: 'From story: ' + text,
                user: {
                    _id: currentUser.uid,
                    avatar: currentUser.userImg ?? ''
                },
                image: story.uri ?? '',
            }
            dispatch(sendMessage(chatId, message))
        }))
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={'transparent'} translucent />
            {story && story.uri ? <Image source={{ uri: story.uri }} style={styles.story} /> : <></>}

            {/* button next to story */}
            <Pressable style={[styles.buttonPrevStory, { right: 0 }]} onPress={goToNextStory} />

            {/* header */}
            <LinearGradient
                colors={['rgba(0, 0, 0, 0.5)', 'transparent']}
                style={styles.header}
            >
                {/* indicator bar */}
                <View style={styles.indicatorContainer}>
                    {user.data.map((story: MediaItem, index: number) => {
                        return (
                            <View key={story.uri + index} style={[styles.indicatorShadow, index < storyIndex && { backgroundColor: COLORS.socialWhite }]}>
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
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <LinearGradient colors={[COLORS.gradient[0], COLORS.gradient[1]]} style={styles.avatarStyle}>
                        <Image source={{ uri: user.userImg }} style={styles.avatarStyle1} />
                    </LinearGradient>
                    <View style={styles.textWrap}>
                        <TextComponent text={user.userName} style={{ fontWeight: 'bold' }} />
                        <TextComponent text={moment(user.createdAt).fromNow()} />
                    </View>
                    <TouchableOpacity style={{ flex: 1, alignItems: 'flex-end' }} onPress={handlePressOptions}>
                        <UtilIcons.svgDotsVertical color={COLORS.socialWhite} size={25} />
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            {/* button prev story */}
            <Pressable style={styles.buttonPrevStory} onPress={goToPrevStory} />

            {/* footer */}
            {
                user.userId != currentUser.uid ? (
                    <View style={styles.footer}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.textInput}
                                placeholder='Type your message here...'
                                placeholderTextColor={COLORS.socialWhite}
                                onChangeText={setText}
                                value={text}
                            />
                            <TouchableOpacity onPress={onSend}>
                                <LinearGradient colors={[COLORS.gradient[0], COLORS.gradient[1]]} style={styles.buttonSend}>
                                    <UtilIcons.svgSend color={COLORS.socialWhite} />
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : <></>
            }
            <AppBottomSheet
                ref={optionsStorySheetRef}
                snapPoints={[SIZES.height * 0.25]}
                backgroundStyle={{ backgroundColor: COLORS.darkGrey }}
                containerStyle={{ margin: SIZES.base, borderRadius: SIZES.padding }}
                handleIndicatorStyle={{ backgroundColor: COLORS.lightGrey }}
                onClose={() => setIsPaused(false)}
            >
                <StoryOption
                    storyData={user}
                    indexImage={storyIndex}
                    onClose={() => {
                        optionsStorySheetRef.current.close()
                        setIsPaused(false)
                    }}
                    callback={() => {
                        if (user.data.length === 1) {
                            navigation.goBack()
                        } else {
                            if (storyIndex > 0) {
                                setStoryIndex(pre => pre - 1)
                            }
                            animationStory()
                        }
                    }}
                />
            </AppBottomSheet>
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