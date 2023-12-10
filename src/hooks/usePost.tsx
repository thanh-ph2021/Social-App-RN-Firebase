import { useState } from 'react'
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import { PostModel } from '../Models'

const usePost = (): [
    PostModel[],
    boolean,
    FirebaseFirestoreTypes.CollectionReference<FirebaseFirestoreTypes.DocumentData>,
    () => Promise<void>,
    (userID: string) => Promise<void>,
    (post: PostModel) => Promise<void>
] => {
    const collection = firestore().collection('Posts')
    const [data, setData] = useState<PostModel[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const getPost = async () => {
        try {
            setIsLoading(true)
            await collection
                .orderBy('postTime', 'desc')
                .get()
                .then((querySnapshot) => {
                    let postList: PostModel[] = []
                    querySnapshot.forEach((doc) => {
                        const { post, postImg, postTime, likes, comments, userID } = doc.data()
                        postList.push({
                            id: doc.id,
                            post: post,
                            userID: userID,
                            postImg: postImg,
                            likes: likes ?? 0,
                            comments: comments ?? 0,
                            postTime: postTime,
                        })
                    })
                    setData(postList)
                })
        } catch (error) {
            console.log("🚀 ~ file: usePost.tsx:31 ~ getPost ~ error:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const getPostByUserID = async (userID: string) => {
        try {
            setIsLoading(true)
            await collection
                .where('userID', '==', userID)
                .orderBy('postTime', 'desc')
                .get()
                .then((querySnapshot) => {
                    let postList: PostModel[] = []
                    querySnapshot.forEach((doc) => {
                        const { post, postImg, postTime, likes, comments, userID } = doc.data()
                        postList.push({
                            id: doc.id,
                            post: post,
                            userID: userID,
                            postImg: postImg,
                            likes: likes ?? 0,
                            comments: comments ?? 0,
                            postTime: postTime,
                        })
                    })
                    setData(postList)
                })
        } catch (error) {
            console.log("🚀 ~ file: usePost.tsx:31 ~ getPost ~ error:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const addPost = async (post: PostModel) => {
        try {
            setIsLoading(true)
            await collection
                .add({
                    userID: post.userID,
                    post: post.post,
                    postImg: post.postImg,
                    postTime: post.postTime,
                    likes: null,
                    comments: null
                })
        } catch (error) {
            console.log("🚀 ~ file: usePost.tsx:48 ~ addPost ~ error:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return [data, isLoading, collection, getPost, getPostByUserID, addPost]
}

export default usePost