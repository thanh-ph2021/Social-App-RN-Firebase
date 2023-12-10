import { useEffect, useState } from 'react'
import { Text, View, TouchableOpacity, Image } from 'react-native'
import { MessageModel, UserModel } from '../Models'
import { styles } from '../styles'
import { SIZES, FONTS, COLORS, images } from '../constants'
import { getUser } from '../utils'
import moment from 'moment'

type MessageCardProps = {
    item: MessageModel,
    navigation: any
}

const MessageCard = ({ item, navigation }: MessageCardProps) => {

    const [userData, setUserData] = useState<UserModel>()

    const onPress = () => {
        navigation.navigate('Chat', { userData: userData, userID: item.userID, chatID: item.id })
    }

    useEffect(() => {
        getUser(item.userID, setUserData)
    }, [])

    return (
        <TouchableOpacity onPress={onPress}>
            <View style={{ flexDirection: 'row', marginHorizontal: SIZES.base, marginTop: SIZES.base, alignItems: 'center' }}>
                {userData?.userImg ? (
                    <Image source={{ uri: userData?.userImg }} style={styles.avatar} />
                ) : (
                    <Image source={images.defaultImage} style={styles.avatar} />
                )}

                <View style={{ marginLeft: SIZES.padding, flex: 1, borderBottomColor: COLORS.lightGray, borderBottomWidth: 1, paddingVertical: SIZES.base }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ ...FONTS.body3, fontWeight: 'bold', color: COLORS.black }}>{userData?.fname} {userData?.lname}</Text>
                        <Text style={{ ...FONTS.body4, }}>{moment(item.messageTime.toDate()).fromNow()}</Text>
                    </View>

                    <Text numberOfLines={1} style={{ ...FONTS.body3, }}>{item.messageText}</Text>

                </View>
            </View>
        </TouchableOpacity>
    )
}

export default MessageCard