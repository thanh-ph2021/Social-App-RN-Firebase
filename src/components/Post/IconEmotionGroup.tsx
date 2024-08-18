import { useEffect, useState } from 'react'
import { View, Image } from 'react-native'

import { TypeEmotion, images } from '../../constants'
import { utilStyles } from '../../styles'
import { LikeModel } from '../../models'

type IconEmotionGroupProps = {
    emotionData: LikeModel[]
}

const IconEmotionGroup = ({ emotionData }: IconEmotionGroupProps) => {

    const [data, setData] = useState<string[]>(emotionData.map(item => item.type))

    useEffect(() => {
        selectTop3Emotion()
    }, [emotionData])

    const selectTop3Emotion = () => {
        const countOccurrences = emotionData.map(item => item.type).reduce((acc: Record<string, number>, item: string) => {
            acc[item] = (acc[item] || 0) + 1
            return acc
        }, {});

        const sortedOccurrences = Object.entries(countOccurrences).sort((a, b) => b[1] - a[1])

        const topThree = sortedOccurrences.slice(0, 3).map(item => item[0])
        setData(topThree)
    }

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