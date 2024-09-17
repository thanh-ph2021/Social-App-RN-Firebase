import { DeviceModel } from "../../models"
import { ADD_DEVICE, FETCH_DEVICES, REMOVE_DEVICE, SET_ACTIVE_DEVICE, UPDATE_DEVICE } from "../constants/device"
import { ActionType } from "../types"

export interface DeviceState {
    devices: DeviceModel[],
    activeDevice: string[]
}

const initialState: DeviceState = {
    devices: [],
    activeDevice: []
}

const device = (state: DeviceState = initialState, action: ActionType) => {
    switch (action.type) {
        case FETCH_DEVICES:
            return { ...state, devices: action.payload }
        case ADD_DEVICE:
            return { ...state, devices: [...state.devices, action.payload] }
        case UPDATE_DEVICE:
            return {
                ...state,
                devices: state.devices.map(device => {
                    if (device.deviceID === action.payload.deviceID) {
                        return action.payload
                    }
                    return device
                })
            }
        case REMOVE_DEVICE:
            return { ...state, devices: state.devices.filter(device => device.deviceID !== action.payload) }
        case SET_ACTIVE_DEVICE:
            return { ...state, activeDevice: action.payload }
        default:
            return state
    }
}

export default device