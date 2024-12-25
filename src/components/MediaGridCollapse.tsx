import React, { memo, useState } from 'react'
import { View, Text, TouchableWithoutFeedback, StyleProp, ViewStyle } from 'react-native'
import FastImage, { ImageStyle } from 'react-native-fast-image'

import { SIZES, COLORS, FONTS } from '../constants'
import { MediaItem } from '../models'
import LightBox, { ImageType } from './LightBox'
import AppVideo from './AppVideo'

type MediaGridCollapseProps = {
    medias: MediaItem[],
    style?: StyleProp<ViewStyle>,
    imageStyle?: ImageStyle,
    shouldPlayVideo?: boolean,
}

const MediaGridCollapse = ({ medias, style, imageStyle, shouldPlayVideo }: MediaGridCollapseProps) => {

    const check = medias.length > 3
    const length = medias.length
    const text = check ? (length - 3).toString() : undefined
    const newMediaUri = check ? medias.slice(0, 3) : medias
    const [visible, setVisible] = useState(false)

    const Item = ({ data, style }: { data: MediaItem, style: StyleProp<ImageStyle> }) => {
        return <TouchableWithoutFeedback onPress={() => setVisible(true)}>
            {
                data.type == 'image' ? (
                    <FastImage source={{ uri: data.uri }} resizeMode='cover' style={style} />
                ) : (
                    <AppVideo 
                        source={{uri: data.uri}}
                        onPressVideo={() => {}}
                        shouldPlay={shouldPlayVideo ?? false}
                    />
                )
            }
        </TouchableWithoutFeedback>

    }

    const renderLightBox = () => {
        const sources: ImageType[] = [...medias].map(media => { return { source: { uri: media.uri } } })
        if (medias[0].type === 'video') return
        return <LightBox visible={visible} onRequestClose={() => setVisible(false)} sources={sources} />
    }

    if (newMediaUri.length == 0) {
        return <></>
    }

    if (newMediaUri.length == 1) {
        return <View>
            <Item data={newMediaUri[0]} style={imageStyle ? imageStyle : { height: 180, marginHorizontal: SIZES.padding, borderRadius: 16 }} />
            {renderLightBox()}
        </View>
    }

    if (newMediaUri.length == 2) {
        return (
            <View>
                <View style={{ flexDirection: 'row', columnGap: SIZES.divider, height: 250 }}>
                    <Item data={newMediaUri[0]} style={{ flex: 1 }} />
                    <Item data={newMediaUri[1]} style={{ flex: 1 }} />

                </View>
                {renderLightBox()}
            </View>

        )
    }

    return (
        <View>
            <View style={{ flexDirection: 'row', columnGap: SIZES.divider, height: 250 }}>
                <Item data={newMediaUri[0]} style={{ flex: 1 }} />
                <View style={{ flex: 1, rowGap: SIZES.divider }}>
                    <Item data={newMediaUri[1]} style={{ flex: 1 }} />
                    <View style={{ flex: 1 }}>
                        <Item data={newMediaUri[2]} style={{ flex: 1 }} />
                        {text ? (
                            <View
                                style={{
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'absolute',
                                    left: 0, top: 0, right: 0, bottom: 0
                                }}
                            >
                                <Text style={{ ...FONTS.h2, color: COLORS.white, opacity: 1 }}>{`+ ${text}`}</Text>
                            </View>
                        ) : <></>}
                    </View>
                </View>
            </View>
            {renderLightBox()}
        </View>
    )
}

export default memo(MediaGridCollapse)