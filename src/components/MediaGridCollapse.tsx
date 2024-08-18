import { View, Image, Text, TouchableWithoutFeedback } from 'react-native'
import Video from 'react-native-video'

import { SIZES, COLORS, FONTS } from '../constants'
import { MediaItem } from '../models'

type MediaGridCollapseProps = {
    media: MediaItem[],
    onPressImage: (media: MediaItem) => void
}

const MediaGridCollapse = ({ media, onPressImage }: MediaGridCollapseProps) => {

    const check = media.length > 3
    const length = media.length
    const text = check ? (length - 3).toString() : undefined
    const newMediaUri = check ? media.slice(0, 3) : media

    const Item = ({ data, style }: { data: MediaItem, style: any }) => {
        return <TouchableWithoutFeedback onPress={() => onPressImage(data)}>
            {
                data.type == 'image' ? (
                    <Image source={{ uri: data.uri }} resizeMode='cover' style={style} />
                ) : (
                    <Video
                        source={{ uri: data.uri }}
                        resizeMode='cover'
                        style={style}
                        muted
                        poster={data.uri}
                    />
                )
            }
        </TouchableWithoutFeedback>

    }

    if (newMediaUri.length == 0) {
        return <></>
    }

    if (newMediaUri.length == 1) {
        return <Item data={newMediaUri[0]} style={{ height: 180, marginHorizontal: SIZES.padding, borderRadius: 16 }} />
    }

    if (newMediaUri.length == 2) {
        return (
            <View style={{ flexDirection: 'row', columnGap: SIZES.divider, height: 250 }}>
                <Item data={newMediaUri[0]} style={{ flex: 1 }} />
                <Item data={newMediaUri[1]} style={{ flex: 1 }} />
            </View>
        )
    }

    return (
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
    )
}

export default MediaGridCollapse