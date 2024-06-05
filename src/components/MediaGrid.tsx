import React from 'react'
import { View, FlatList, Image, StyleSheet, ListRenderItem, TouchableOpacity } from 'react-native'
import Video from 'react-native-video'
import { GiphyMedia } from '@giphy/react-native-sdk'

import { COLORS, SIZES } from '../constants'
import Icon, { TypeIcons } from './Icon'
import { MediaItem } from '../models'
import { MediaViewSample } from './Giphy/MediaViewSample'

interface MediaGridProps {
  mediaArray: MediaItem[]
  giphyMedias: GiphyMedia[]
  delMedia?: (uri: string) => void
  delGiphyMedia?: (mediaID: string) => void
}

const MediaGrid: React.FC<MediaGridProps> = ({ mediaArray, giphyMedias, delMedia, delGiphyMedia }) => {

  const data = mediaArray.length > 0 ? mediaArray : giphyMedias

  const renderItem: ListRenderItem<any> = ({ item }) => {
    return (
      <View>
        {!item.id
          ?
          (item.type == 'image' ? (
            <Image source={{ uri: item.uri }} resizeMode='cover' style={mediaArray.length > 1 ? styles.image : { ...styles.image, width: SIZES.width, marginLeft: 0 }} />
          ) : (
            <Video source={{ uri: item.uri }}
              resizeMode='cover'
              style={data.length > 1 ? styles.image : { ...styles.image, width: SIZES.width, marginLeft: 0 }} />
          ))
          :
          (
            <View style={[data.length > 1 ? styles.image : { ...styles.image, width: '100%', marginLeft: 0 , alignSelf: 'center' }, { aspectRatio: item.aspectRatio }]}>
              <MediaViewSample media={item} />
            </View>
          )
        }

        <TouchableOpacity
          style={styles.buttonDelImage}
          onPress={() => {
            if (item.id) {
              delGiphyMedia && delGiphyMedia(item.id)
            } else {
              delMedia && delMedia(item.uri)
            }
          }}
        >
          <Icon type={TypeIcons.Feather} name='x' size={SIZES.icon} color={COLORS.black} />
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      snapToEnd
      horizontal
    />
  )
}

const styles = StyleSheet.create({
  image: {
    width: SIZES.width * 0.5,
    height: 250,
    marginLeft: SIZES.base
  },
  buttonDelImage: {
    padding: 4,
    margin: SIZES.base,
    borderRadius: 50,
    backgroundColor: COLORS.white,
    position: 'absolute',
    top: 0,
    right: 0
  },
});

export default MediaGrid