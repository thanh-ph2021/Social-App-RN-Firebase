import { memo, useEffect, useRef, useState } from 'react'
import { View, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import Video, { OnLoadData, OnProgressData } from 'react-native-video'
import moment from 'moment'

import { PostModel, UserModel } from '../../models'
import Avatar from '../Avatar'
import { useAppSelector } from '../../hooks'
import { selectUserByUID } from '../../redux/selectors'
import { COLORS, SIZES } from '../../constants'
import TextComponent from '../TextComponent'
import { UtilIcons } from '../../utils/icons'

interface Props {
    data: PostModel,
    shouldPlay: boolean,
    onPressAvatar: (userID: string) => void,
    onPressVideo: () => void
}

const VideoItem = (props: Props) => {

    const { data, shouldPlay, onPressAvatar, onPressVideo } = props
    const videoRef = useRef<any>()
    const [showProgress, setShowProgress] = useState<boolean>(true)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [muted, setMuted] = useState(true)
    const [paused, setPaused] = useState(false)
    const userData: UserModel = useAppSelector(state => selectUserByUID(state, data.userID))

    useEffect(() => {
        let timeoutID: NodeJS.Timeout
        if (duration && !paused) {
            timeoutID = setTimeout(() => {
                setShowProgress(false)
            }, 3000)
        }

        return () => clearTimeout(timeoutID)

    }, [duration, paused])

    useEffect(() => {

        if (shouldPlay) {
            setPaused(false)
        } else {
            setPaused(true)
        }

    }, [shouldPlay])

    useEffect(() => {
        if (videoRef.current && duration) {
            videoRef.current.seek(1)
        }
    }, [duration])

    const onLoad = (data: OnLoadData) => {
        setDuration(data.duration)
    }

    const onProgress = (data: OnProgressData) => {
        if (showProgress) {
            setCurrentTime(data.currentTime)
        }
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins >= 10 ? mins : '0' + mins}:${secs >= 10 ? secs : '0' + secs}`
    }

    return (
        <View style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={onPressVideo}>
                <View>
                    <Video
                        ref={videoRef}
                        source={{ uri: data.media![0].uri }}
                        resizeMode='cover'
                        style={styles.video}
                        onLoad={onLoad}
                        onProgress={onProgress}
                        paused={paused}
                        repeat
                        muted={muted}
                    />
                    {(duration !== 0 && showProgress) && <TextComponent
                        text={formatTime(duration - currentTime)}
                        style={{
                            position: 'absolute',
                            left: SIZES.padding,
                            bottom: SIZES.base,
                            padding: 5,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            borderRadius: SIZES.base,
                            fontWeight: 'bold'
                        }}
                    />}
                    <TouchableOpacity style={{ position: 'absolute', right: SIZES.padding, bottom: SIZES.base, padding: SIZES.base }} onPress={() => setMuted(!muted)}>
                        {muted ? (
                            <UtilIcons.svgMute size={20} color={COLORS.socialWhite} />
                        ) : (
                            <UtilIcons.svgVolumeUp size={20} color={COLORS.socialWhite} />
                        )}
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>

            <View style={{ padding: SIZES.padding, flexDirection: 'row' }}>
                <Avatar source={{ uri: userData.userImg }} size='l' onPress={() => onPressAvatar(userData.uid!)} />
                <View style={{ paddingHorizontal: SIZES.padding }}>
                    <TextComponent text={data.post} numberOfLines={1} />
                    <View style={{ flexDirection: 'row', gap: SIZES.base }}>
                        <TextComponent text={`${userData.fname} ${userData.lname}`} color={COLORS.lightGrey} />
                        <TextComponent text={moment(data.postTime.toDate()).fromNow()} color={COLORS.lightGrey} />
                    </View>
                </View>
            </View>
        </View >
    )
}

export default memo(VideoItem)


const styles = StyleSheet.create({
    video: {
        width: '100%',
        aspectRatio: 16 / 9,
    }
})