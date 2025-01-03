import React, { useRef } from 'react'
import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage'
import { Alert, Platform, View, Text, ImageRequireSource, Image } from 'react-native'
import messaging from '@react-native-firebase/messaging'
import { PermissionsAndroid } from 'react-native'
import { Notifier } from 'react-native-notifier'
import { ImageOrVideo } from 'react-native-image-crop-picker'

import { COLORS, FONTS, SIZES } from '../constants'
import { UserModel } from '../models'
import { DocumentItem } from '../models/DocumentItem'
import { UtilIcons } from './icons'
import { Source } from 'react-native-fast-image'

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

export const showNotification = (title: string, Icon: () => React.ReactElement, typeNoti?: 'error' | 'success' | 'warning', marginTop?: number) => {
    Notifier.showNotification({
        duration: 5000,
        title: title,
        Component: (props) => {
            let color = COLORS.black
            switch (typeNoti) {
                case 'error':
                    color = COLORS.red
                    break
                case 'success':
                    color = COLORS.green
                    break
                case 'warning':
                    color = COLORS.yellow
                    break
            }
            return (
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: COLORS.white,
                    padding: SIZES.base,
                    margin: SIZES.base,
                    borderRadius: SIZES.base,
                    elevation: 5,
                    marginTop: marginTop ?? undefined
                }}>
                    <Icon />
                    <Text style={{ ...FONTS.body3, color: color, paddingLeft: SIZES.padding, flexShrink: 1 }}>{props.title}</Text>
                </View>
            )
        }
    })
}

export const getTimeNow = () => {
    return firestore.Timestamp.fromDate(new Date())
}

export function useLatest<V>(value: V) {
    const ref = useRef<V>(value)
    ref.current = value
    return ref
}

export function readableFileSize(attachmentSize?: number) {
    const DEFAULT_SIZE = 0;
    const fileSize = attachmentSize ?? DEFAULT_SIZE;

    if (!fileSize) {
        return `${DEFAULT_SIZE} kb`;
    }

    const sizeInKb = fileSize / 1024;

    if (sizeInKb > 1024) {
        return `${(sizeInKb / 1024).toFixed(2)} mb`;
    } else {
        return `${sizeInKb.toFixed(2)} kb`;
    }
}

export const uploadMedia = async (nameFolder: string, media?: ImageOrVideo, doc?: DocumentItem) => {
    try {
        if (media) {
            const url = Platform.OS == 'ios' ? media.sourceURL : media.path

            if (url) {
                let filename = url.substring(url.lastIndexOf('/') + 1)
                const storageRef = storage().ref(`${nameFolder}/${filename}`)

                await storageRef.putFile(url)

                return {
                    type: media.mime.includes('image') ? 'image' : 'video',
                    url: await storageRef.getDownloadURL()
                }
            }
        } else if (doc) { // doc
            const storageRef = storage().ref(`${nameFolder}/${doc.name}`)
            await storageRef.putFile(doc.url!)

            const urlFile = await storageRef.getDownloadURL()
            return {
                ...doc,
                url: urlFile
            }
        }
    } catch (error) {
        console.log('Upload media to firebase error', error)
    }
}

export const showNotificationComingSoon = (marginTop?: number) => {
    showNotification('This feature will be available in an upcoming update. Stay tuned!', UtilIcons.success, 'success', marginTop)
}

export function getGreeting() {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
        return "Good morning";
    } else if (currentHour >= 12 && currentHour < 17) {
        return "Good afternoon";
    } else if (currentHour >= 17 && currentHour < 21) {
        return "Good evening";
    } else {
        return "Good night";
    }
}

export const getHitSlop = (padding: number) => ({
    top: padding,
    bottom: padding,
    left: padding,
    right: padding,
})

export const getImageSize = (source: Source | ImageRequireSource): Promise<{ width: number, height: number }> => {
    return new Promise((resolve, reject) => {
        if (typeof source === 'number') {
            const { width, height } = Image.resolveAssetSource(source)
            resolve({ width, height })
        } else if (typeof source === 'object' && 'uri' in source && source.uri) {
            Image.getSize(source.uri, (width, height) => {
                resolve({ width, height })
            })
        } else {
            reject(console.log('Invalid image source'))
        }
    })
}
