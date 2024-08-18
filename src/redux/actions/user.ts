import { firebase } from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

import { LOAD_USERS, UPDATE_CURRENT_USER_DATA, UPDATE_USER_DATA, USER_STATE_CHANGE } from '../constants'
import { UserModel } from '../../models'
import { AppThunk } from '../types'

const userCollection = firestore().collection('users')

export const fetchUser = (): AppThunk => async (dispatch) => {
    try {
        const uid = firebase.auth().currentUser!.uid
        await userCollection
            .doc(uid)
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {
                    dispatch({ type: USER_STATE_CHANGE, payload: { uid: uid, ...snapshot.data() } })
                }
            })
    } catch (error) {
    }
}

export const fetchUsers = (): AppThunk => async (dispatch) => {
    try {
        await userCollection
            .get()
            .then((snapshot) => {
                let users = snapshot.docs.map(doc => {
                    const data = doc.data()
                    const uid = doc.id

                    return { uid, ...data }
                })
                dispatch({ type: LOAD_USERS, payload: users })
            })
    } catch (error) {
    }
}

export const updateUser = (userData: UserModel): AppThunk => async (dispatch) => {
    try {
        const uid = firebase.auth().currentUser!.uid
        if (userData.uid && userData.uid === uid) {
            dispatch({ type: UPDATE_CURRENT_USER_DATA, payload: userData })
        }

        dispatch({ type: UPDATE_USER_DATA, payload: userData })

        await userCollection
            .doc(userData.uid)
            .update(userData)


    } catch (error) {
        console.log("🚀 ~ updateUser ~ error:", error)
    }
}

export const searchUsers = async (textSearch: string) => {
    try {
        const users = await userCollection
            .get()
            .then(snapshot => {
                let users = snapshot.docs.map(doc => {
                    const data = doc.data()
                    const uid = doc.id

                    return { uid, ...data }
                })

                return users.filter((user: UserModel) => {
                    const userName = `${user.fname} ${user.lname}`.toLowerCase()
                    return userName.includes(textSearch.toLowerCase())
                })
            })

        return users

    } catch (error) {
        console.log("🚀 ~ searchUsers ~ error:", error)
    }
}