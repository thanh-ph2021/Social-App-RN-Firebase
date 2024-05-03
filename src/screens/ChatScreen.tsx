import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useCallback, useEffect } from 'react'
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useRoute } from '@react-navigation/native'

import { COLORS, SIZES } from '../constants'
import { useAuthContext, useChat } from '../hooks'
import { MessageItemModel, UserModel } from '../models'
import useNotification from '../hooks/useNotification'
import { Avatar, Divider, Header, TextComponent } from '../components'
import { UtilIcons } from '../utils/icons'

const ChatScreen = ({ navigation }: NativeStackScreenProps<any>) => {

    const { params } = useRoute<any>()
    const receiveUser: UserModel = params.userData
    const { user } = useAuthContext()
    const { messages, setMessages, addMessage, loadMessageRealTime } = useChat()
    const { sendNotification } = useNotification()

    useEffect(() => {
        receiveUser.userImg

        const subscriber = loadMessageRealTime(params?.chatID, receiveUser.userImg ?? '')

        // Stop listening for updates when no longer required
        return () => subscriber
    }, [])

    const onSend = useCallback((messages: MessageItemModel[] | any[] = []) => {
        setMessages((previousMessages: any) =>
            GiftedChat.append(previousMessages, messages),
        )
        addMessage(params?.chatID, messages)
        sendNotification({
            body: messages[0].text,
            title: `${user!.fname} ${user!.lname}`,
            data: {
                id: user!.uid!,
                type: 'message'
            },
        }, receiveUser?.uid!)
    }, [])

    const renderBubble = (props: any) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: COLORS.blue
                    }
                }}
                textStyle={{
                    right: {
                        color: COLORS.white
                    }
                }}
            />
        )
    }

    const renderSend = (props: any) => {
        return (
            <Send {...props}>
                <View style={{ padding: SIZES.base }} >
                    <Ionicons name='send' color={COLORS.blue} size={SIZES.icon} />
                </View>
            </Send>
        )
    }

    const scrollToBottomComponent = () => {
        return (
            <Ionicons name='arrow-down-circle-outline' size={SIZES.icon} color={COLORS.lightGrey} />
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.darkBlack }}>
            <Header
                title={'CREATE'}
                containerStyle={{ marginBottom: SIZES.padding }}
                centerComponent={
                    <View style={{ alignItems: 'center' }}>
                        <Avatar source={{ uri: receiveUser.userImg }} size='m' />
                        <TextComponent text={`${receiveUser.fname} ${receiveUser.lname}`} style={{ fontWeight: 'bold', marginTop: 4 }} />
                    </View>
                }
                leftComponent={
                    <TouchableOpacity style={styles.btnHeaderLeft} onPress={() => navigation.goBack()}>
                        <UtilIcons.svgArrowLeft color={COLORS.socialWhite} size={20} />
                    </TouchableOpacity>
                }
                rightComponent={
                    <TouchableOpacity
                        style={styles.btnHeaderLeft}
                        onPress={() => navigation.goBack()}>
                        <UtilIcons.svgDotsVertical color={COLORS.socialWhite} size={20} />
                    </TouchableOpacity>
                }
            />
            <Divider />
            <View style={{ flex: 1 }}>
                <GiftedChat
                    messages={messages}
                    onSend={messages => onSend(messages)}
                    user={{
                        _id: user!.uid!,
                    }}
                    renderBubble={renderBubble}
                    alwaysShowSend
                    renderSend={renderSend}
                    scrollToBottom
                    scrollToBottomComponent={scrollToBottomComponent}
                />
            </View>

        </View>

    )
}

export default ChatScreen

const styles = StyleSheet.create({
    btnHeaderLeft: {
        width: 32,
        height: 32,
        borderRadius: 20,
        borderColor: COLORS.lightGrey,
        borderWidth: 1,
        marginHorizontal: SIZES.padding,
        alignItems: 'center',
        justifyContent: 'center'
    }
})