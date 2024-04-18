import { View } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { COLORS, SIZES } from '../constants'
import { useCallback, useEffect, useState } from 'react'
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat'
import { IMessage } from 'react-native-gifted-chat/lib/Models'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { MessageItemModel, UserModel } from '../models'
import { useRoute } from '@react-navigation/native'
import firestore from '@react-native-firebase/firestore'
import { useAuthContext, useChat } from '../hooks'
import useNotification from '../hooks/useNotification'

const ChatScreen = ({ navigation }: NativeStackScreenProps<any>) => {

    const { params } = useRoute<any>()
    const receiveUser: UserModel = params.userData
    const { user } = useAuthContext()
    const { messages, setMessages, addMessage, loadMessageRealTime } = useChat()
    const { sendNotification } = useNotification()

    useEffect(() => {
        navigation.setOptions({
            title: `${receiveUser?.fname} ${receiveUser?.lname}`
        })
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
            <Ionicons name='arrow-down-circle-outline' size={SIZES.icon} color={COLORS.gray} />
        )
    }

    return (
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
    )
}

export default ChatScreen