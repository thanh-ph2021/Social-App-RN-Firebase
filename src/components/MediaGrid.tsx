import React from 'react'
import { View, FlatList, Image, StyleSheet, ListRenderItem, TouchableOpacity } from 'react-native'
import Icon, { TypeIcons } from './Icon'
import { COLORS, SIZES } from '../constants'
import Video from 'react-native-video'
import { MediaItem } from '../models'

interface MediaGridProps {
  mediaArray: MediaItem[]
  delMedia?: (uri: string) => void
}

const MediaGrid: React.FC<MediaGridProps> = ({ mediaArray, delMedia }) => {

  const renderItem: ListRenderItem<MediaItem> = ({ item }) => {
    return (
      <View>
        {item.type == 'image' ? (
          <Image source={{ uri: item.uri }} resizeMode='cover' style={mediaArray.length > 1 ? styles.image : { ...styles.image, width: SIZES.width, marginLeft: 0 }} />
        ) : (
          <Video source={{ uri: item.uri }}   // Can be a URL or a local file.
            // ref={(ref) => {
            //   this.player = ref
            // }}                                      // Store reference
            // onBuffer={this.onBuffer}                // Callback when remote video is buffering
            // onError={this.videoError}               // Callback when video cannot be loaded
            resizeMode='cover'
            style={mediaArray.length > 1 ? styles.image : { ...styles.image, width: SIZES.width, marginLeft: 0 }} />
        )}

        <TouchableOpacity style={styles.buttonDelImage} onPress={() => delMedia && delMedia(item.uri)}>
          <Icon type={TypeIcons.Feather} name='x' size={SIZES.icon} color={COLORS.black} />
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <FlatList
      data={mediaArray}
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

  backgroundVideo: {
    position: 'absolute',
    width: '100%',
    height: 250,
    top: 20,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default MediaGrid