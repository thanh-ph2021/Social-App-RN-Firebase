import firestore from '@react-native-firebase/firestore'
import { firebase } from '@react-native-firebase/auth'
import DeviceInfo from 'react-native-device-info'

import { DeviceModel } from "../../models"
import { AppThunk } from "../types"
import { ADD_DEVICE, FETCH_DEVICES, UPDATE_DEVICE } from '../constants/device'

const collection = firestore().collection('users')

export const fetchDevices = (): AppThunk => async (dispatch) => {
    try {
        const uid = firebase.auth().currentUser!.uid

        await collection
            .doc(uid)
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {
                    dispatch({ type: FETCH_DEVICES, payload: snapshot.data()?.devices ?? [] })
                }
            })

    } catch (error) {
        console.log("🚀 ~ fetchDevices ~ error:", error)
    }
}

export const addDevice = (notifyToken: string): AppThunk => async (dispatch, getState) => {
    try {
        // fetch old device from state
        await dispatch(fetchDevices())
        const oldDevices = getState().deviceState.devices

        const deviceIDs = oldDevices.map((device: DeviceModel) => device.deviceID)
        const tokens = oldDevices.flatMap((device: DeviceModel) => device.notifyToken)

        // get device information
        const [deviceID, deviceName, deviceOSVersion, deviceOS, deviceBrand] = await Promise.all([
            DeviceInfo.getDeviceId(),
            DeviceInfo.getDeviceName(),
            DeviceInfo.getSystemVersion(),
            DeviceInfo.getSystemName(),
            DeviceInfo.getBrand()
        ])
        const uid = firebase.auth().currentUser!.uid

        // create new device object
        const newDevice: DeviceModel = {
            deviceID,
            deviceName,
            deviceBrand,
            deviceOS,
            deviceOSVersion,
            notifyToken,
            lastLogin: firestore.Timestamp.fromDate(new Date()),
        }

        // Check if the token or device ID already exists
        if (tokens.includes(notifyToken)) return

        let updateDevices = [...oldDevices]
        if (deviceIDs.includes(deviceID)) {
            updateDevices = oldDevices.map((device: DeviceModel) => device.deviceID === deviceID ? newDevice : device)

            dispatch({ type: UPDATE_DEVICE, payload: newDevice })
        } else {
            updateDevices.push(newDevice)
            dispatch({ type: ADD_DEVICE, payload: newDevice })
        }

        // Update devices in Firestore
        await collection.doc(uid).update({ devices: updateDevices })

    } catch (error) {
        console.log("🚀 ~ addDevice ~ error:", error)
    }
}