import { View, Image } from 'react-native'

import { TypeEmotion, images } from '../../constants'
import { utilStyles } from '../../styles'

type IconEmotionGroupProps = {
    emotionData: string[]
}

const IconEmotionGroup = ({ emotionData }: IconEmotionGroupProps) => {

    const data = emotionData.slice(0, 3)
    
    return (
        <View style={{ flexDirection: 'row-reverse', alignItems: 'flex-end', }}>
            {data.includes(TypeEmotion.Sad) && <Image source={images.sad} style={utilStyles.iconEmotion} />}
            {data.includes(TypeEmotion.Wow) && <Image source={images.wow} style={utilStyles.iconEmotion} />}
            {data.includes(TypeEmotion.Haha) && <Image source={images.haha} style={utilStyles.iconEmotion} />}
            {data.includes(TypeEmotion.Angry) && <Image source={images.angry} style={utilStyles.iconEmotion} />}
            {data.includes(TypeEmotion.Care) && <Image source={images.care} style={utilStyles.iconEmotion} />}
            {data.includes(TypeEmotion.Love) && <Image source={images.love} style={utilStyles.iconEmotion} />}
            {data.includes(TypeEmotion.Like) && <Image source={images.like} style={utilStyles.iconEmotion} />}
        </View>
    )
}

export default IconEmotionGroup