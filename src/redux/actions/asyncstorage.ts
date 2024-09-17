import AsyncStorage from "@react-native-async-storage/async-storage"
import { COMMENT_NOTI, FOLLOW_NOTI, LIKE_NOTI, LOAD_ASYNCSTORAGE } from "../constants/asyncstorage"
import { AppThunk } from "../types"

export const loadStorage = (): AppThunk => async (dispatch) => {
    try {
        let payload
        const [followNoti, commentNoti, likeNoti] = await Promise.all([
            AsyncStorage.getItem(FOLLOW_NOTI),
            AsyncStorage.getItem(COMMENT_NOTI),
            AsyncStorage.getItem(LIKE_NOTI),
        ])
        if (followNoti == null || commentNoti == null || likeNoti == null) {
            await Promise.all([
                AsyncStorage.setItem(FOLLOW_NOTI, 'true'),
                AsyncStorage.setItem(COMMENT_NOTI, 'true'),
                AsyncStorage.setItem(LIKE_NOTI, 'true'),
            ])

            payload = {
                followNoti: true,
                commentNoti: true,
                likeNoti: true,
            }
        } else {
            payload = {
                followNoti: followNoti === 'true',
                commentNoti: commentNoti === 'true',
                likeNoti: likeNoti === 'true',
            }
        }

        dispatch({ type: LOAD_ASYNCSTORAGE, payload: payload })
    } catch (error) {
        console.log("🚀 ~ updateStorage ~ error:", error)
    }
}

export const updateStorage = (type: string, payload: boolean): AppThunk => async (dispatch) => {
    try {
        await AsyncStorage.setItem(type, `${payload}`)
        dispatch({ type, payload })
    } catch (error) {
        console.log("🚀 ~ updateStorage ~ error:", error)
    }
}