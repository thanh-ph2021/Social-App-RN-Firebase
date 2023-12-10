import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage'
import { Alert } from 'react-native'
import { UserModel } from '../Models'

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
                            lname: data.lname,
                            fname: data.fname,
                            email: data.email,
                            userImg: data.userImg,
                            about: data.about,
                            phone: data.phone,
                            country: data.country,
                            city: data.city
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