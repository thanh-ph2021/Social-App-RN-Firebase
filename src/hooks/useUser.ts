import { useState } from 'react'
import { NotificationRequest, UserModel } from '../models'
import { URL_HOSTING } from '../constants'
import firestore from '@react-native-firebase/firestore'

const useUser = () => {

    const [data, setData] = useState<UserModel | undefined>()
    const collection = firestore().collection('users')

    const getUserFromHook: (userID: string) => Promise<UserModel | undefined> = async (userID: string) => {
        try {
            let userData: UserModel = {}
            await collection
                .doc(userID)
                .get()
                .then((documentSnapshot) => {
                    if (documentSnapshot.exists) {
                        const data = documentSnapshot.data()
                        if (data) {
                            userData = {
                                ...data,
                                uid: documentSnapshot.id
                            }
                        }
                    }
                })

            return userData
        } catch (error) {
            console.log("🚀 ~ file: useUser.ts:36 ~ getUser ~ error:", error)
        }
    }

    return { getUserFromHook }
}

export default useUser