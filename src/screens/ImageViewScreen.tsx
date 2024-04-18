import { useRoute } from '@react-navigation/native'
import { View, StatusBar, Image } from 'react-native'
import { styles } from '../styles'
import { COLORS } from '../constants'
import ImageViewer from 'react-native-image-zoom-viewer'
import { MediaItem } from '../models'
import Video from 'react-native-video'

const ImageViewScreen = () => {

    const { params } = useRoute<any>()
    const { media } = params

    return (
        <View style={{ ...styles.container, backgroundColor: COLORS.black }}>
            <StatusBar
                hidden={true}
            />
            {
                media.type == 'image' ? (
                    <ImageViewer imageUrls={[{ url: media.uri }]} style={{ width: '100%' }} />
                ) : (
                    <Video
                        source={{ uri: media.uri }}
                        resizeMode='cover'
                        style={{ width: '100%', height: '80%' }}
                        repeat
                    />
                )
            }


        </View>
    )
}

export default ImageViewScreen