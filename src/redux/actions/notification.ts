import firestore from '@react-native-firebase/firestore'
import { firebase } from '@react-native-firebase/auth'

import { AppThunk } from "../types"
import { LIMIT, TypeNotification, URL_HOSTING } from '../../constants'
import { FETCH_NOTIFICATIONS, MARK_ALL_READ, MARK_AS_READ } from '../constants/notification'
import { NotificationModel } from '../../models/NotificationModel'
import { DeviceModel, NotificationRequest } from '../../models'

const notiCollection = firestore().collection('Notifications')

export const fetchNotifications = (): AppThunk => async (dispatch, getState) => {
    try {
        const uid = firebase.auth().currentUser!.uid

        await notiCollection
            .where('receiverId', '==', uid)
            .orderBy('createdAt', 'desc')
            .limit(LIMIT)
            .get()
            .then((snapshot) => {
                let notifications = snapshot.docs.map(doc => {
                    const data = doc.data()
                    const id = doc.id

                    return { id, ...data }
                })
                dispatch({ type: FETCH_NOTIFICATIONS, payload: { notifications, hashMore: snapshot.size === LIMIT } })
            })
    } catch (error) {
        console.log("🚀 ~ fetchNotifications ~ error:", error)
    }
}

export const fetchNextNotifications = (): AppThunk => async (dispatch, getState) => {
    try {
        const uid = firebase.auth().currentUser!.uid
        const { notifications } = getState().notificationState

        if (notifications.length > 0) {
            await notiCollection
                .where('receiverId', '==', uid)
                .orderBy('createdAt', 'desc')
                .startAfter(notifications[notifications.length - 1].createdAt)
                .limit(LIMIT)
                .get()
                .then((snapshot) => {
                    let nextNotis = snapshot.docs.map(doc => {
                        const data = doc.data()
                        const id = doc.id

                        return { id, ...data }
                    })

                    dispatch({
                        type: FETCH_NOTIFICATIONS,
                        payload: {
                            notifications: [...notifications, ...nextNotis],
                            hashMore: snapshot.size === LIMIT
                        }
                    })
                })
        }
    } catch (error) {
        console.log("🚀 ~ fetchNotifications ~ error:", error)
    }
}

export const deleteDuplicateNotis = async (notification: NotificationModel) => {
    try {
        let notiIds: string[] = []
        let typeNotiEmotion: string[] = [TypeNotification.Angry, TypeNotification.Care, TypeNotification.Haha, TypeNotification.Like,
        TypeNotification.Love, TypeNotification.Sad, TypeNotification.Wow]

        const isTypeNotiEmotion = typeNotiEmotion.includes(notification.type)

        await notiCollection
            .where('senderId', '==', notification.senderId)
            .where('postId', '==', notification.postId)
            .where('type', 'in', isTypeNotiEmotion ? typeNotiEmotion : [notification.type])
            .where('receiverId', '==', notification.receiverId)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    notiIds.push(doc.id!)
                })
            })

        const tasks = notiIds.map(id => notiCollection.doc(id).delete())

        await Promise.all(tasks)

    } catch (error) {
        console.log("🚀 ~ deleteNotis ~ error:", error)
    }
}

export const addNotification = (notification: NotificationModel): AppThunk => async (dispatch, getState) => {
    try {
        await deleteDuplicateNotis(notification)

        await notiCollection
            .add(notification)

        const notificationRequest: NotificationRequest = {
            title: 'Notification',
            body: notification.message,
            data: {
                id: notification.postId ?? notification.senderId,
                type: notification.type
            },
        }

        sendNotification(notificationRequest, [notification.receiverId])

    } catch (error) {
        console.log("🚀 ~ addNotification ~ error:", error)
    }
}

export const markAsReadNoti = (notification: NotificationModel): AppThunk => async (dispatch, getState) => {
    try {
        if (notification.isRead === true) {
            return
        }

        await notiCollection
            .doc(notification.id)
            .update({ isRead: true })

        await dispatch({ type: MARK_AS_READ, payload: { ...notification, isRead: true } })

    } catch (error) {
        console.log("🚀 ~ addNotification ~ error:", error)
    }
}

export const markAllReadNoti = (): AppThunk => async (dispatch, getState) => {
    try {

        const { notifications } = getState().notificationState
        const newNotis = notifications.map((noti: NotificationModel) => { return { ...noti, isRead: true } })
        await dispatch({ type: MARK_ALL_READ, payload: newNotis })

        const tasks = notifications
            .filter((noti: NotificationModel) => noti.isRead === false)
            .map((noti: NotificationModel) => notiCollection.doc(noti.id).update({ isRead: true }))
        await Promise.all(tasks)

    } catch (error) {
        console.log("🚀 ~ addNotification ~ error:", error)
    }
}

export const getNotifyToken: (uid: string) => Promise<string[] | undefined> = async (uid: string) => {
    try {
        let token: string[] = []
        await firestore().collection('users')
            .doc(uid)
            .get()
            .then((queryData) => {
                if (queryData.exists && queryData.data()?.devices) {
                    token = queryData.data()?.devices.flatMap((device: DeviceModel) => device.notifyToken)
                }
            })
        return token
    } catch (error) {
        console.log("🚀 ~ file: getNotifyToken: ~ error:", error)
    }
}

export const sendNotification = async (contentNotification: NotificationRequest, receiveUserID: string[]) => {
    try {
        let tokens: any = []
        const tasks = receiveUserID.map(item => getNotifyToken(item))

        const results = await Promise.allSettled(tasks)
        tokens = results
            .filter(result => result.status === 'fulfilled')
            .map(result => (result as PromiseFulfilledResult<any>).value)
            .flat()

        if (tokens && tokens.length != 0) {
            contentNotification = {
                ...contentNotification,
                notifyTokens: tokens
            }
            await fetch(URL_HOSTING, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(contentNotification),
            }).then(response => {
                console.log("🚀 ~ file: sendNotification ~ response:", response)
            })
        }
    } catch (error) {
        console.log("🚀 ~ file: sendNotification ~ error:", error)
    }
}