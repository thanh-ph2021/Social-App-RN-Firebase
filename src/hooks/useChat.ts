import { useState } from 'react'
import firestore from '@react-native-firebase/firestore'
import { MessageItemModel, MessageModel } from '../models'
import useAuthContext from './useAuthContext'

const useChat = () => {
    const collection = firestore().collection('Chats')
    const [data, setData] = useState<MessageModel[]>([])
    const [messages, setMessages] = useState<MessageItemModel[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { user } = useAuthContext()
    const filter = firestore.Filter

    const getChat = async () => {
        setIsLoading(true)
        try {
            let data: MessageModel[] = []
            await collection
                .where(filter.or(
                    filter('to_user', '==', user?.uid),
                    filter('from_user', '==', user?.uid)
                ))
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        const { last_msg, msg_time, from_user, to_user } = doc.data()
                        data.push({
                            id: doc.id,
                            userID: user && user.uid == from_user ? to_user : from_user,
                            messageText: last_msg,
                            messageTime: msg_time,
                        })
                    });
                    setData(data)
                })
        } catch (error) {
            console.log("🚀 ~ file: useChat.ts:26 ~ getChat ~ error:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const getChatCondition: (toUID: string) => Promise<string | undefined> = async (toUID: string) => {
        try {
            let chatID = undefined
            await collection
                .where(filter.or(
                    filter('to_user', '==', user?.uid),
                    filter('from_user', '==', user?.uid)
                ))
                .where(filter.or(
                    filter('to_user', '==', toUID),
                    filter('from_user', '==', toUID)
                ))
                .get()
                .then(querySnapshot => {
                    if (querySnapshot.size > 0) {
                        chatID = querySnapshot.docs[0].id.toString()
                    }
                })
            return chatID
        } catch (error) {
            console.log("🚀 ~ file: useChat.ts:67 ~ addChatData ~ error:", error)
            return undefined
        }
    }

    const addChatData = async (toUID: string, callback: (chatID: string) => void) => {
        try {
            await collection
                .where(filter.or(
                    filter('to_user', '==', user?.uid),
                    filter('from_user', '==', user?.uid)
                ))
                .where(filter.or(
                    filter('to_user', '==', toUID),
                    filter('from_user', '==', toUID)
                ))
                .get()
                .then(async (querySnapshot) => {
                    if (querySnapshot.size > 0) {
                        callback(querySnapshot.docs[0].id)
                    } else {
                        await collection
                            .add({
                                to_user: user?.uid,
                                from_user: toUID,
                                last_msg: '',
                                msg_time: firestore.Timestamp.fromDate(new Date())
                            })
                            .then((doc) => {
                                callback(doc.id)
                            })
                    }
                })
        } catch (error) {
            console.log("🚀 ~ file: useChat.ts:67 ~ addChatData ~ error:", error)
        }
    }

    const updateChat = async (chatID: string, messages: any) => {
        try {
            setIsLoading(true)
            await collection
                .doc(chatID)
                .update({
                    last_msg: messages[0].text,
                    msg_time: messages[0].createdAt
                })
        } catch (error) {
            console.log("🚀 ~ file: usePost.tsx:48 ~ addPost ~ error:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const addMessage = async (chatID: string, messages: any) => {
        try {
            const msgListCollection = firestore().collection(`Chats/${chatID}/msgList`)
            await msgListCollection.add(messages[0])
                .then(async () => {
                    await updateChat(chatID, messages)
                })
        } catch (error) {
            console.error(error)
        }
    }

    const loadMessageRealTime = (chatID: string, imgUrl: string) => {
        const msgListCollection = firestore().collection(`Chats/${chatID}/msgList`)
        msgListCollection
            .orderBy('createdAt', 'desc')
            .onSnapshot(documentSnapshot => {
                let messageArr: any[] = []
                documentSnapshot.forEach(item => {
                    const { _id, createdAt, text, user } = item.data()
                    messageArr.push({
                        _id: _id,
                        text: text,
                        createdAt: createdAt.toDate(),
                        user: {
                            _id: user._id,
                            avatar: user._id == user.uid ? '' : imgUrl
                        }
                    })
                })

                setMessages(messageArr)
            });
    }

    return { data, messages, setMessages, isLoading, collection, getChat, addChatData, updateChat, addMessage, loadMessageRealTime, getChatCondition }
}

export default useChat