import { Image, View } from 'react-native'

import TextComponent from '../TextComponent'
import { SIZES } from '../../constants'

interface Props {
    uri: string,
    text: string,
}

const ImageItem = (props: Props) => {

    const { uri, text } = props
    const size = SIZES.width * 0.325

    return (
        <View style={{ width: size, height: size, margin: 2 }}>
            <Image
                source={{ uri: uri }}
                style={{ width: size, height: size }}
                resizeMode='cover'
            />
            <TextComponent text={text} style={{ position: 'absolute', bottom: 0 }} numberOfLines={1} showFullLine />
        </View>
    )
}

export default ImageItem