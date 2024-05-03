import { useEffect, useState } from 'react'
import { View, TouchableOpacity, Image } from 'react-native'
import moment from 'moment'
import { SIZES, FONTS, COLORS, images } from '../constants'
import { MessageModel, UserModel } from '../models'
import { getUser } from '../utils'
import { utilStyles } from '../styles'
import TextComponent from './TextComponent'
import Avatar from './Avatar'

type MessageCardProps = {
    item: MessageModel,
    navigation: any,
    type?: 'default' | 'pinned'
}

const MessageCard = ({ item, navigation, type }: MessageCardProps) => {

    const [userData, setUserData] = useState<UserModel>()

    const onPress = () => {
        navigation.navigate('Chat', { userData: userData, chatID: item.id })
    }

    useEffect(() => {
        getUser(item.userID, setUserData)
    }, [])

    if (type && type == 'pinned') {
        return (
            <TouchableOpacity onPress={onPress}>
                <View style={{ marginTop: SIZES.base, alignItems: 'center' }}>
                    {userData?.userImg ? (
                        <Avatar source={{ uri: userData?.userImg }} size={'xl'} />
                    ) : (
                        <Image source={images.defaultImage} style={utilStyles.avatar} />
                    )}
                    <TextComponent text={`${userData?.fname} ${userData?.lname}`} style={{ fontWeight: 'bold', paddingTop: SIZES.base }} />
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <TouchableOpacity onPress={onPress}>
            <View style={{ flexDirection: 'row', marginHorizontal: SIZES.base, marginTop: SIZES.base, alignItems: 'center' }}>
                {userData?.userImg ? (
                    <Avatar source={{ uri: userData?.userImg }} size={'l'} />
                ) : (
                    <Image source={images.defaultImage} style={utilStyles.avatar} />
                )}

                <View style={{ marginLeft: SIZES.padding, flex: 1, paddingVertical: SIZES.base }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: SIZES.base }}>
                        <TextComponent text={`${userData?.fname} ${userData?.lname}`} style={{ fontWeight: 'bold' }} />
                        <TextComponent text={moment(item.messageTime.toDate()).fromNow()} style={{ ...FONTS.body5 }} color={COLORS.lightGrey} />
                    </View>
                    <TextComponent text={item.messageText} numberOfLines={1} />
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default MessageCard
