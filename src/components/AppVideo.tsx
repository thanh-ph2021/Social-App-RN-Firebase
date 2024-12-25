import React, { memo, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native"
import Video from "react-native-video"
import { SIZES, COLORS } from "../constants";
import { UtilIcons } from "../utils/icons";

interface AppVideoProps {
    source: | { uri?: string | undefined; headers?: { [key: string]: string } | undefined; type?: string | undefined }
    | number,
    shouldPlay: boolean,
    onPressVideo: () => void
}

const AppVideo = (props: AppVideoProps) => {
    const { source, shouldPlay, onPressVideo } = props
    const videoRef = useRef<any>()
    const [muted, setMuted] = useState(true)
    const [paused, setPaused] = useState(true)

    return (
        <TouchableOpacity style={{ flex: 1 }} >
            <Video
                ref={videoRef}
                source={source}
                resizeMode='cover'
                style={styles.video}
                paused={paused}
                repeat
                muted={muted}
            />
            <TouchableOpacity
                style={{ ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' }}
                onPress={() => setPaused(pre => !pre)}
            >
                {paused ? (
                    <View style={{backgroundColor: COLORS.grey5209, padding: SIZES.padding, borderRadius: SIZES.padding}}>
                        <UtilIcons.svgPlayVideo size={30} />
                    </View>
                ) : <></>}
            </TouchableOpacity>
            <TouchableOpacity style={{ position: 'absolute', right: SIZES.padding, bottom: SIZES.base, padding: SIZES.base }} onPress={() => setMuted(!muted)}>
                {muted ? (
                    <UtilIcons.svgMute size={20} color={COLORS.socialWhite} />
                ) : (
                    <UtilIcons.svgVolumeUp size={20} color={COLORS.socialWhite} />
                )}
            </TouchableOpacity>
        </TouchableOpacity>
    )
}

export default memo(AppVideo)

const styles = StyleSheet.create({
    video: {
        width: SIZES.width - SIZES.base * 2,
        aspectRatio: 16 / 9,
        marginHorizontal: SIZES.base,
        borderRadius: SIZES.base * 2
    }
})