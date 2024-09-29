import firestore, { firebase } from '@react-native-firebase/firestore'

import { AppThunk } from "../types"
import { MessageItemModel, MessageModel, UserModel } from '../../models'
import { ADD_CHAT, FETCH_CHATS, MARK_CHAT_AS_READ, PIN_CONVERSATION, SEARCH_CHAT, UPDATE_CHAT } from '../constants/chat'

const chatCollection = firestore().collection('Chats')

export const fetchChats = (): AppThunk => async (dispatch, getState) => {
    try {
        const uid = firebase.auth().currentUser!.uid

        await chatCollection
            .where('participants', 'array-contains', uid)
            .orderBy('messageTime', 'desc')
            .get()
            .then((querySnapshot) => {
                const conversations: MessageModel[] = querySnapshot.docs.map(snapshot => {
                    const data = snapshot.data()
                    let id = snapshot.id
                    const userID = data.participants.filter((user: string) => user != uid)[0]

                    return { ...data, id, userID } as MessageModel
                })
                dispatch({ type: FETCH_CHATS, payload: { conversations } })
            })
    } catch (error) {
        console.log("🚀 ~ fetchChats ~ error:", error)
    }
}

export const addChat = (toUID: string, callback: (chatID: string) => void): AppThunk => async (dispatch, getState) => {
    try {
        const uid = getState().userState.currentUser.uid
        const createdAt = firestore.Timestamp.fromDate(new Date())
        const participants = [uid, toUID].sort()
        await chatCollection
            .where('participants', '==', participants)
            .get()
            .then(async (querySnapshot) => {
                if (querySnapshot.size > 0) {
                    // chat exist
                    callback(querySnapshot.docs[0].id)
                } else {
                    await chatCollection
                        .add({
                            participants,
                            lastMessage: '',
                            messageTime: createdAt,
                            unread: {
                                [uid]: 0,
                                [toUID]: 0
                            }
                        })
                        .then(async (doc) => {
                            await dispatch({
                                type: ADD_CHAT,
                                payload: {
                                    id: doc.id,
                                    userID: toUID,
                                    lastMessage: '',
                                    messageTime: createdAt,
                                    unread: {
                                        [uid]: 0,
                                        [toUID]: 0
                                    }
                                }
                            })
                            callback(doc.id)
                        })
                }
            })
    } catch (error) {
        console.log("🚀 ~ addChat ~ error:", error)
    }
}

export const updateChat = (chatID: string, message: MessageItemModel): AppThunk => async (dispatch) => {
    try {
        let lastMessage = message.text
        if (message.image) {
            lastMessage = `[image]`
        }
        if (message.video) {
            lastMessage = `[video]`
        }

        if (message.document) {
            lastMessage = `[document]`
        }
        
        await chatCollection
            .doc(chatID)
            .update({
                lastMessage: lastMessage,
                messageTime: message.createdAt,
            })

        dispatch({
            type: UPDATE_CHAT, payload: {
                conversation: {
                    messageTime: firestore.Timestamp.fromDate(message.createdAt),
                    lastMessage: lastMessage,
                },
                id: chatID
            }
        })
    } catch (error) {
        console.log("🚀 ~ updateChat ~ error:", error)
    }
}

export const searchChat = (textSearch: string): AppThunk => async (dispatch, getState) => {
    try {
        const conversations = getState().chatState.conversations
        const users = getState().userState.users.filter((user: UserModel) => {
            return user.fname?.includes(textSearch) || user.lname?.includes(textSearch)
        })?.map((user: UserModel) => user.uid)
        let searchChats: MessageModel[] = []

        if (users && users.length > 0) {
            searchChats = conversations.filter((item: MessageModel) => users.includes(item.userID))
        }

        dispatch({ type: SEARCH_CHAT, payload: searchChats })
    } catch (error) {
        console.log("🚀 ~ searchChat ~ error:", error)
    }
}

export const markChatAsRead = (chatID: string): AppThunk => async (dispatch, getState) => {
    try {
        const currentUserId = getState().userState.currentUser.uid

        await chatCollection.doc(chatID).update({
            [`unread.${currentUserId}`]: 0
        })

        dispatch({ type: MARK_CHAT_AS_READ, payload: { chatID, userId: currentUserId } })
    } catch (error) {
        console.log("🚀 ~ searchChat ~ error:", error)
    }
}

export const pinConversation = (chatID: string, pinned: boolean): AppThunk => async (dispatch, getState) => {
    try {
        dispatch({ type: PIN_CONVERSATION, payload: { pinned, chatID } })

        await chatCollection.doc(chatID).update({
            pinned
        })
    } catch (error) {
        console.log("🚀 ~ pinConversation ~ error:", error)
    }
}