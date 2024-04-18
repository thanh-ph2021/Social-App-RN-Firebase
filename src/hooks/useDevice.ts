import { useState } from 'react'
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import { DeviceModel } from '../models'
import DeviceInfo from 'react-native-device-info'
import useAuthContext from './useAuthContext'

const useDevice = (): [
    boolean,
    FirebaseFirestoreTypes.CollectionReference<FirebaseFirestoreTypes.DocumentData>,
    (notifyToken: string, userID: string) => Promise<void>,
    (userID: string) => Promise<string>
] => {
    const collection = firestore().collection('Devices')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { user, setUser } = useAuthContext()

    const getNotifyToken: (userID: string) => Promise<string> = async (userID: string) => {
        try {
            const deviceID = await DeviceInfo.getDeviceId()
            await collection
                .where('deviceID', '==', deviceID)
                .where('userID', '==', userID)
                .get()
                .then(querySnapshot => {
                    if (querySnapshot && querySnapshot.size > 0) {
                        return querySnapshot.docs[0].data().notifyToken
                    }
                })
            return ''

        } catch (error) {
            throw new Error("error when check deviceID")
        }
    }

    const checkDeviceIDExists: (deviceID: string, userID: string) => Promise<boolean> = async (deviceID: string, userID: string) => {
        try {
            const querySnapshot = await collection
                .where('deviceID', '==', deviceID)
                .where('userID', '==', userID)
                .get()
            return querySnapshot.size > 0
        } catch (error) {
            throw new Error("error when check deviceID")
        }
    }

    const addDevice = async (notifyToken: string, userID: string) => {
        const deviceID = await DeviceInfo.getDeviceId()
        const deviceName = await DeviceInfo.getDeviceName()
        const deviceOSVersion = await DeviceInfo.getSystemVersion()
        const deviceOS = await DeviceInfo.getSystemName()
        const deviceBrand = await DeviceInfo.getBrand()

        // setUser({...user, notifyToken: notifyToken})

        try {
            setIsLoading(true)
            const isDeviceExists = await checkDeviceIDExists(deviceID, userID)

            if (!isDeviceExists) {
                const data: DeviceModel = {
                    deviceID: deviceID,
                    deviceName: deviceName,
                    deviceBrand: deviceBrand,
                    deviceOS: deviceOS,
                    deviceOSVersion: deviceOSVersion,
                    notifyToken: notifyToken,
                    createAt: firestore.Timestamp.fromDate(new Date()),
                    userID: userID
                }
                await collection.add(data)
            }
        } catch (error) {
            console.log("🚀 ~ file: usePost.tsx:48 ~ addPost ~ error:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return [isLoading, collection, addDevice, getNotifyToken]
}

export default useDevice