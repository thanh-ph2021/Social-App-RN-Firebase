import { useState } from 'react'
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import { MessageItemModel, MessageModel } from '../Models'
import useAuthContext from './useAuthContext'

const useChat = (): [
    MessageModel[],
    MessageItemModel[],
    React.Dispatch<React.SetStateAction<MessageItemModel[]>>,
    boolean,
    FirebaseFirestoreTypes.CollectionReference<FirebaseFirestoreTypes.DocumentData>,
    () => Promise<void>,
    (toUID: string, callback: (chatID: string) => void) => Promise<void>,
    (chatID: string, messages: any) => Promise<void>,
    (chatID: string, messages: any) => Promise<void>,
    (chatID: string, imgUrl: string) => void
] => {
    const collection = firestore().collection('Chats')
    const [data, setData] = useState<MessageModel[]>([])
    const [messages, setMessages] = useState<MessageItemModel[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { user } = useAuthContext()

    const getChat = async () => {
        setIsLoading(true)
        try {
            let data: MessageModel[] = []
            await collection
                .where('userID', 'array-contains', user?.uid)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        const { last_msg, msg_time, userID } = doc.data()
                        data.push({
                            id: doc.id,
                            userID: user && user.uid == userID[0] ? userID[1] : userID[0],
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

    const addChatData = async (toUID: string, callback: (chatID: string) => void) => {
        try {
            await collection
                .where('userID', 'array-contains', [user?.uid, toUID])
                .get()
                .then(async (querySnapshot) => {
                    if (querySnapshot.size > 0) {
                        callback(querySnapshot.docs[0].id)
                    } else {
                        await collection
                            .add({
                                userID: [user?.uid, toUID],
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

    return [data, messages, setMessages, isLoading, collection, getChat, addChatData, updateChat, addMessage, loadMessageRealTime]
}

export default useChat