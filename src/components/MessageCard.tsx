import { View, TouchableOpacity, Image, StyleSheet } from 'react-native'
import moment from 'moment'
import { SIZES, FONTS, COLORS, images } from '../constants'
import { MessageModel } from '../models'
import { utilStyles } from '../styles'
import TextComponent from './TextComponent'
import Avatar from './Avatar'
import { useAppDispatch, useAppSelector } from '../hooks'
import { selectUserByUID } from '../redux/selectors'
import { markChatAsRead } from '../redux/actions/chat'

type MessageCardProps = {
    item: MessageModel,
    navigation: any,
    type?: 'default' | 'pinned'
}

const MessageCard = ({ item, navigation, type }: MessageCardProps) => {

    const toUser = useAppSelector(state => selectUserByUID(state, item.userID))
    const currentUser = useAppSelector(state => state.userState.currentUser)
    const dispatch = useAppDispatch()

    const onPress = () => {
        dispatch(markChatAsRead(item.id!))
        navigation.navigate('Chat', { userData: toUser, chatID: item.id })
    }

    if (type && type == 'pinned') {
        return (
            <TouchableOpacity onPress={onPress}>
                <View style={{ marginTop: SIZES.base, alignItems: 'center' }}>
                    {toUser?.userImg ? (
                        <Avatar source={{ uri: toUser?.userImg }} size={'xl'} />
                    ) : (
                        <Image source={images.defaultImage} style={utilStyles.avatar} />
                    )}
                    <TextComponent text={`${toUser?.fname} ${toUser?.lname}`} style={{ fontWeight: 'bold', paddingTop: SIZES.base }} />
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <TouchableOpacity onPress={onPress}>
            <View style={{ flexDirection: 'row', marginHorizontal: SIZES.base, marginTop: SIZES.base, alignItems: 'center' }}>
                {toUser?.userImg ? (
                    <Avatar source={{ uri: toUser?.userImg }} size={'l'} />
                ) : (
                    <Image source={images.defaultImage} style={utilStyles.avatar} />
                )}

                <View style={{ marginLeft: SIZES.padding, flex: 1, paddingVertical: SIZES.base }}>
                    <View style={styles.wrapText}>
                        <TextComponent text={`${toUser?.fname} ${toUser?.lname}`} style={{ fontWeight: 'bold' }} />
                        <TextComponent text={moment(item.messageTime.toDate()).fromNow()} style={{ ...FONTS.body5 }} color={COLORS.lightGrey} />
                    </View>
                    <View style={styles.wrapText}>

                        {
                            item.lastMessage
                                ? (
                                    <TextComponent
                                        text={item.lastMessage}
                                        numberOfLines={1}
                                        isShowTextRead
                                        color={item.unread[currentUser.uid] > 0 ? COLORS.socialWhite : COLORS.lightGrey}
                                    />
                                )
                                : (<TextComponent text={'You are now connected'} color={COLORS.lightGrey} />)
                        }

                        {
                            item.unread && item.unread[currentUser.uid] > 0
                                ? <View style={{ width: 10, height: 10, backgroundColor: COLORS.redLight, borderRadius: SIZES.padding }} />
                                : <></>
                        }
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default MessageCard

const styles = StyleSheet.create({
    wrapText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SIZES.base,
    }
})
