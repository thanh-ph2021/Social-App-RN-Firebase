import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Pressable, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import Video, { OnLoadData, OnProgressData } from 'react-native-video'
import Orientation, { OrientationType } from 'react-native-orientation-locker'
import Slider from '@react-native-community/slider'
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

import { utilStyles } from '../styles'
import { Avatar, Header, TextComponent } from '../components'
import { COLORS, SIZES, FONTS } from '../constants'
import { UtilIcons } from '../utils/icons'
import { LikeModel, UserModel } from '../models'
import { useAppDispatch, useAppSelector } from '../hooks'
import { selectUserByUID } from '../redux/selectors'
import moment from 'moment'
import LikeButton from '../components/Post/LikeButton'
import { updatePost } from '../redux/actions/post'

const VideoDetailScreen = ({ navigation, route }: NativeStackScreenProps<any>) => {

    const { params } = route
    const [data, setData] = useState(params ? params.data : null)
    const videoRef = useRef<any>()
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(-1)
    const [muted, setMuted] = useState(true)
    const [paused, setPaused] = useState(false)
    const userData: UserModel = useAppSelector(state => selectUserByUID(state, data.userID))
    const currentUser = useAppSelector(state => state.userState.currentUser)
    const [tag, setTag] = useState(currentUser.postTags ? currentUser.postTags.includes(data.id!) : false)
    const dispatch = useAppDispatch()
    const [fullscreen, setFullscreen] = useState(false)
    const [videoSize, setVideoSize] = useState({ width: 1, height: 1 })
    const opacity = useSharedValue(1)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    const hideVideoControl = () => {
        if (opacity.value == 1 && fullscreen) {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }

            timeoutRef.current = setTimeout(() => {
                opacity.value = withTiming(0, { duration: 2000 })
            }, 2000)
        }
    }
    const videoControlStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(opacity.value, { duration: opacity.value == 0 ? 2000 : 200 }, (isFinished) => {
                if (isFinished) {
                    runOnJS(hideVideoControl)()
                }
            })
        }
    })

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [])

    useEffect(() => {
        const handleOrientationChange = (orientation: OrientationType) => {
            if (orientation === 'LANDSCAPE-LEFT' || orientation === 'LANDSCAPE-RIGHT') {
                setFullscreen(true)
            } else {
                setFullscreen(false)
            }
        }

        Orientation.addOrientationListener(handleOrientationChange)
        Orientation.unlockAllOrientations()

        return () => {
            Orientation.removeOrientationListener(handleOrientationChange)
        }
    }, [])

    const onLoad = (data: OnLoadData) => {
        setVideoSize({ height: data.naturalSize.height, width: data.naturalSize.width })
        setDuration(data.duration)
    }

    const onProgress = (data: OnProgressData) => {
        setCurrentTime(data.currentTime)
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs >= 10 ? secs : '0' + secs}`
    }

    const toggleFullscreen = async () => {
        if (fullscreen) {
            Orientation.lockToPortrait()
        } else {
            Orientation.lockToLandscape()
        }
        setFullscreen(!fullscreen)
    }

    const onSeek = (value: number) => {
        videoRef.current.seek(value)
        setCurrentTime(value)
        // setShowControls(true)
        // resetControlTimeout()
    }

    const handleLike = useCallback(async (typeEmotion: string, isModal?: boolean) => {
        try {
            const copyLikes = data.likes ? [...data.likes] : []
            const userID = currentUser.uid
            const index = copyLikes.find(item => item.userID == userID)
            let newLikes: LikeModel[] = []

            if (index) {
                // liked
                if (isModal) {
                    // change like
                    const oldLikes = copyLikes.filter(item => item.userID != userID)
                    newLikes = [
                        ...oldLikes,
                        {
                            type: typeEmotion,
                            userID: userID
                        }
                    ]
                } else {
                    // dislike
                    newLikes = copyLikes.filter(item => item.userID != userID)
                }

            } else {
                // no like
                // add like
                newLikes = [
                    ...copyLikes,
                    {
                        type: typeEmotion,
                        userID: userID
                    }
                ]
            }

            setData({
                ...data,
                likes: newLikes
            })

            dispatch(updatePost({
                ...data,
                likes: newLikes
            }))
        } catch (error) {
            console.log("🚀 ~ handleLike ~ error:", error)
        }

    }, [data.likes])

    return (
        <View style={utilStyles.containerBackground}>
            <StatusBar hidden={fullscreen} />
            <Pressable
                style={fullscreen ? {
                    height: SIZES.width,
                    width: SIZES.height,
                    position: 'absolute'
                } : {
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    height: SIZES.height,
                    top: 0
                }}
                onPress={() => {
                    opacity.value = opacity.value == 0 ? 1 : 0
                }}
            >
                <Video
                    ref={videoRef}
                    source={{ uri: data.media![0].uri }}
                    resizeMode='contain'
                    style={fullscreen ? { height: SIZES.width, width: SIZES.height, position: 'absolute' } : { width: '100%', aspectRatio: videoSize.width / videoSize.height }}
                    onLoad={onLoad}
                    onProgress={onProgress}
                    paused={paused}
                    // repeat
                    muted={muted}
                />
            </Pressable>

            <Header
                title=''
                leftComponent={
                    <TouchableOpacity style={utilStyles.btnHeaderLeft} onPress={() => navigation.goBack()}>
                        <UtilIcons.svgArrowLeft color={COLORS.socialWhite} />
                    </TouchableOpacity>
                }
                rightComponent={
                    <TouchableOpacity style={{ paddingRight: SIZES.padding }} onPress={() => { }}>
                        <UtilIcons.svgDotsVertical color={COLORS.socialWhite} />
                    </TouchableOpacity>
                }
                visible={fullscreen}
            />

            <Animated.View style={[videoControlStyle, { position: 'absolute', bottom: 0, marginBottom: SIZES.padding, width: '100%' }]}>
                <View style={{
                    flexDirection: 'row',
                    paddingBottom: SIZES.base,
                    alignSelf: 'flex-end',
                    alignItems: 'center',
                    gap: SIZES.padding * 3,
                    marginHorizontal: SIZES.padding
                }}>
                    <TouchableOpacity onPress={() => setMuted(!muted)}>
                        {muted ? (
                            <UtilIcons.svgMute size={20} color={COLORS.socialWhite} />
                        ) : (
                            <UtilIcons.svgVolumeUp size={20} color={COLORS.socialWhite} />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={toggleFullscreen}>
                        {fullscreen ? (
                            <UtilIcons.svgExitFullscreen size={15} />
                        ) : (
                            <UtilIcons.svgFullscreen size={15} />
                        )}

                    </TouchableOpacity>
                </View>

                {duration != -1 && <View style={{ flexDirection: 'row', marginBottom: SIZES.base, alignItems: 'center', gap: SIZES.padding, marginHorizontal: SIZES.padding }}>

                    {Math.floor(currentTime) == Math.floor(duration) ? (
                        <TouchableOpacity onPress={() => {
                            // Pause the video first
                            setPaused(true);
                            // Seek to the start of the video
                            videoRef.current.seek(0);
                            // Use setTimeout to ensure seek has completed before unpausing
                            setTimeout(() => {
                                // Unpause the video to start playing from the beginning
                                setPaused(false);
                                setCurrentTime(0);
                            }, 100);

                        }}>
                            <UtilIcons.svgReload size={30} />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => {
                            setPaused(prev => !prev)
                        }}>
                            {paused ? (
                                <UtilIcons.svgPlayVideo size={30} />
                            ) : (
                                <UtilIcons.svgPauseVideo size={30} />
                            )}
                        </TouchableOpacity>
                    )}
                    <View style={{ flex: 1, }}>
                        <Slider
                            value={currentTime}
                            style={{ paddingHorizontal: SIZES.padding }}
                            minimumValue={0}
                            maximumValue={duration}
                            onValueChange={onSeek}
                            minimumTrackTintColor={COLORS.socialWhite}
                            maximumTrackTintColor={COLORS.lightGrey}
                            thumbTintColor={COLORS.socialWhite}
                        />
                        <TextComponent text={`${formatTime(currentTime)} / ${formatTime(duration)}`} style={{ alignSelf: 'flex-end' }} />
                    </View>

                </View>}
                {fullscreen ? <></> : (
                    <View>
                        <View style={{ marginHorizontal: SIZES.padding }}>
                            <View style={{ flexDirection: 'row', paddingBottom: SIZES.base }}>
                                <Avatar source={{ uri: userData.userImg }} size='l' onPress={() => navigation.push('Profile', { userID: userData.uid! })} />
                                <View style={{ paddingHorizontal: SIZES.padding }}>
                                    <TextComponent text={`${userData.fname} ${userData.lname}`} color={COLORS.socialWhite} style={{ ...FONTS.h3 }} />
                                    <TextComponent text={moment(data.postTime.toDate()).fromNow()} color={COLORS.lightGrey} />
                                </View>
                            </View>
                            <TextComponent text={'Chiều 20.6, tại TP.Đà Nẵng, Tập đoàn Hệ thống Cisco khởi động chương trình Tăng tốc chuyển đổi số quốc gia (CDA). Chương trình CDA tại Việt Nam được xây dựng phù hợp với chương trình Chuyển đổi số quốc gia của Chính phủ đến năm 2025, định hướng đến năm 2030 với mục tiêu nâng cao năng lực công nghệ của đất nước.'} numberOfLines={2} />
                        </View>

                        {/* <TextComponent text={data.post} /> */}
                        <View style={styles.buttonContainer}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '45%' }}>
                                {/* likes button */}
                                <LikeButton
                                    data={data.likes ?? []}
                                    handleLike={handleLike}
                                />
                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => navigation.navigate('PostDetailScreen', { data: data })}>
                                    <UtilIcons.svgComment />
                                    <TextComponent text={`${data.commentCount ? data.commentCount : data.comments ? data.comments.length : 0}`} style={{ paddingLeft: SIZES.base }} />
                                </TouchableOpacity>
                                <UtilIcons.svgShare />
                            </View>
                            <TouchableOpacity style={{ alignItems: 'flex-end' }} onPress={() => { }}>
                                <UtilIcons.svgBookmark fill={tag ? COLORS.socialBlue : undefined} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

            </Animated.View>


        </View>
    )
}

export default VideoDetailScreen

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: SIZES.padding,
        marginVertical: SIZES.base
    },
})