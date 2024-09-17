import { COMMENT_NOTI, FOLLOW_NOTI, LIKE_NOTI, LOAD_ASYNCSTORAGE } from "../constants/asyncstorage"
import { ActionType } from "../types"

export interface AsyncStorageState {
    followNoti: boolean,
    commentNoti: boolean,
    likeNoti: boolean

}

const initialState: AsyncStorageState = {
    followNoti: false,
    commentNoti: false,
    likeNoti: false
}

const asyncstorage = (state: AsyncStorageState = initialState, action: ActionType) => {
    switch (action.type) {
        case LOAD_ASYNCSTORAGE:
            return action.payload
        case FOLLOW_NOTI:
            return { ...state, followNoti: action.payload }
        case COMMENT_NOTI:
            return { ...state, commentNoti: action.payload }
        case LIKE_NOTI:
            return { ...state, likeNoti: action.payload }
        default:
            return state
    }
}

export default asyncstorage