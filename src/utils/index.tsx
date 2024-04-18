import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage'
import { Alert, Platform, View, Text } from 'react-native'
import { UserModel } from '../models'
import messaging from '@react-native-firebase/messaging'
import { PermissionsAndroid } from 'react-native'
import React from 'react'
import { Notifier } from 'react-native-notifier'
import { COLORS, FONTS, SIZES } from '../constants'

export const deletePost = async (postId: string, setIsDelete: any) => {
    firestore().collection('Posts')
        .doc(postId)
        .get()
        .then(documentSnapshot => getPostImg(documentSnapshot))
        .then((postImg) => {
            if (postImg != null) {
                const storageRef = storage().refFromURL(postImg)
                const imageRef = storage().ref(storageRef.fullPath)

                imageRef.delete().then(() => {
                    console.log(`${postImg} has been deleted successfully.`)
                    deleteFirestoreData(postId, setIsDelete)
                }).catch((error) => {
                    console.log('deleted image error', error)
                })
            } else {
                deleteFirestoreData(postId, setIsDelete)
            }
        })
}

export const deleteFirestoreData = (postId: string, setIsDelete: any) => {
    firestore().collection('Posts').doc(postId).delete().then(() => {
        Alert.alert('Post deleted!', 'Your post has been deleted Successfully!')
        setIsDelete(true)
    }).catch((error) => {
        console.log('delete firestore data error', error)
    })
}

export function getPostImg(documentSnapshot: any) {
    return documentSnapshot.get('postImg')
}

export const getUser = async (userID: string, setUserData: (newValue: UserModel) => void) => {
    try {
        const currentUser = await firestore()
            .collection('users')
            .doc(userID)
            .get()
            .then((documentSnapshot) => {
                if (documentSnapshot.exists) {
                    const data = documentSnapshot.data()
                    if (data) {
                        setUserData({
                            ...data,
                            uid: documentSnapshot.id
                        })
                    }
                } else {
                    console.error("User does not exist");
                }
            })
    } catch (error) {
        console.error("Error fetching user data:", error)
    }
}

export async function requestUserPermission() {
    if (Platform.OS == 'android') {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)
    } else {
        const authStatus = await messaging().requestPermission()
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL

        if (enabled) {
            // console.log('Authorization status:', authStatus);
        }
    }

}

export const showNotification = (title: string, Icon: () => React.ReactElement) => {
    Notifier.showNotification({
        duration: 5000,
        title: title,
        Component: (props) => {
            return (
                <View style={{ flexDirection: 'row', backgroundColor: COLORS.white, padding: SIZES.base, margin: SIZES.base, borderRadius: SIZES.base, elevation: 5 }}>
                    <Icon />
                    <Text style={{ ...FONTS.body3, color: COLORS.black, paddingLeft: SIZES.padding }}>{props.title}</Text>
                </View>
            )
        }
    })
}

export const getTimeNow = () => {
    return firestore.Timestamp.fromDate(new Date())
}