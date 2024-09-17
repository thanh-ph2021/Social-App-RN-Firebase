import { NotificationModel } from "../../models/NotificationModel"
import { FETCH_NOTIFICATIONS, MARK_ALL_READ, MARK_AS_READ } from "../constants/notification"
import { ActionType } from "../types"

export interface NotificationState {
    notifications: NotificationModel[],
    unreadCount: number,
    hashMore: boolean
}

const initalState: NotificationState = {
    notifications: [],
    unreadCount: 0,
    hashMore: false
}

export const notification = (state: NotificationState = initalState, action: ActionType) => {
    switch (action.type) {
        case FETCH_NOTIFICATIONS:
        case MARK_ALL_READ:
            return {
                ...state,
                notifications: action.payload.notifications,
                unreadCount: action.payload.notifications.filter((noti: NotificationModel) => !noti.isRead).length,
                hashMore: action.payload.hashMore
            }
        case MARK_AS_READ:
            return {
                ...state,
                notifications: state.notifications.map(noti => noti.id === action.payload.id ? action.payload : noti),
                unreadCount: state.unreadCount - 1
            }
        default:
            return state
    }
}