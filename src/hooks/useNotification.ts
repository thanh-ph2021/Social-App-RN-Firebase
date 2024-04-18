import { NotificationRequest } from '../models'
import { URL_HOSTING } from '../constants'
import firestore from '@react-native-firebase/firestore'

const useNotification = () => {

    const getNotifyToken: (uid: string) => Promise<string | undefined> = async (uid: string) => {
        try {
            let token: string = ''
            await firestore().collection('Devices')
                .where('userID', '==', uid)
                .get()
                .then((queryData) => {
                    if (queryData.size > 0) {
                        token = queryData.docs[0].data().notifyToken
                    }
                })
            return token
        } catch (error) {
            console.log("🚀 ~ file: useNotification.ts:21 ~ constgetNotifyToken: ~ error:", error)
        }
    }

    const sendNotification = async (contentNotification: NotificationRequest, receiveUserID: string) => {
        try {
            const token = await getNotifyToken(receiveUserID)

            if (token) {
                contentNotification = {
                    ...contentNotification,
                    notifyTokens: [token]
                }
                await fetch(URL_HOSTING, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(contentNotification),
                }).then(response => {
                    console.log("🚀 ~ file: useNotification.ts:25 ~ sendNotification ~ response:", response)
                })
            }
        } catch (error) {
            console.log("🚀 ~ file: useNotification.ts:42 ~ sendNotification ~ error:", error)
        }
    }

    return { sendNotification }
}

export default useNotification