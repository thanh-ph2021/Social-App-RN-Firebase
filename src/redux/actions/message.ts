import { MessageItemModel, MessageModel } from "../../models"
import { FETCH_MESSAGES_REALTIME, SEND_MESSAGE } from "../constants/message"
import { AppThunk } from "../types"
import firestore from '@react-native-firebase/firestore'
import { updateChat } from "./chat"

export const fetchMessagesRealTime = (chatID: string, imgUrl: string): AppThunk => async (dispatch, getState) => {
    try {
        const msgListCollection = firestore().collection(`Chats/${chatID}/messages`)
        const unsubscribe = msgListCollection
            .orderBy('createdAt', 'desc')
            .onSnapshot(documentSnapshot => {
                let messages: any[] = []
                documentSnapshot.forEach(item => {
                    const data = item.data()
                    const { user, createdAt } = data
                    messages.push({
                        ...data,
                        createdAt: createdAt.toDate(),
                        user: {
                            _id: user._id,
                            avatar: user._id == user.uid ? '' : imgUrl
                        }
                    })
                })

                dispatch({ type: FETCH_MESSAGES_REALTIME, payload: { messages, chatID } })
            })
        return unsubscribe
    } catch (error) {
        console.log("🚀 ~ fetchMessagesRealTime ~ error:", error)
    }
}

export const sendMessage = (chatID: string, message: MessageItemModel): AppThunk => async (dispatch, getState) => {
    try {

        dispatch({ type: SEND_MESSAGE, payload: { chatID, message: message } })

        const currentUserId = getState().userState.currentUser.uid
        const chatRef = firestore().collection('Chats').doc(chatID)

        await firestore().runTransaction(async (transaction) => {
            const newMessageRef = chatRef.collection('messages').doc()
            transaction.set(newMessageRef, message)

            const chatDoc = await transaction.get(chatRef)
            const chatData = chatDoc.data() as MessageModel
            const updateUnread = { ...chatData.unread }

            Object.keys(updateUnread).forEach(userId => {
                if (userId != currentUserId) {
                    updateUnread[userId]++
                }
            })

            transaction.update(chatRef, { unread: updateUnread })

            // update chat last message, message time
            dispatch(updateChat(chatID, message))
        })

    } catch (error) {
        console.log("🚀 ~ addMessage ~ error:", error)
    }
}