import { useState } from 'react'
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import { PostModel } from '../models'
import useMedia from './useMedia'
import { deleteFirestoreData } from '../utils'

// number size every load
const LIMIT = 25

const usePost = () => {
    const collection = firestore().collection('Posts')
    const [data, setData] = useState<PostModel[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { deleteMedia } = useMedia()

    const getPost = async () => {
        try {
            setIsLoading(true)
            await collection
                .where('scope', '==', 'public')
                .orderBy('postTime', 'desc')
                .limit(LIMIT)
                .get()
                .then((querySnapshot) => {
                    let postList: PostModel[] = []
                    querySnapshot.forEach((doc) => {
                        const { post, media, postTime, likes, comments, userID } = doc.data()
                        postList.push({
                            id: doc.id,
                            post: post,
                            userID: userID,
                            media: media,
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

    const getPostNext = async () => {
        try {
            await collection
                .where('scope', '==', 'public')
                .orderBy('postTime', 'desc')
                .startAfter(data[data.length - 1].postTime)
                .limit(LIMIT)
                .get()
                .then((querySnapshot) => {
                    if (querySnapshot.size > 0) {
                        let postList: PostModel[] = []
                        querySnapshot.forEach((doc) => {
                            const { post, media, postTime, likes, comments, userID } = doc.data()
                            postList.push({
                                id: doc.id,
                                post: post,
                                userID: userID,
                                media: media,
                                likes: likes ?? 0,
                                comments: comments ?? 0,
                                postTime: postTime,
                            })
                        })
                        setData([
                            ...data,
                            ...postList
                        ])
                    }
                })
        } catch (error) {
            console.log("🚀 ~ file: usePost.tsx:31 ~ getPost ~ error:", error)
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
                        const { post, media, postTime, likes, comments, userID } = doc.data()
                        postList.push({
                            id: doc.id,
                            post: post,
                            userID: userID,
                            media: media,
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
                    media: post.media,
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

    const updatePost = async (data: PostModel) => {
        try {
            await collection
                .doc(data.id)
                .update(data)
        } catch (error) {
            console.log("🚀 ~ file: usePost.tsx:133 ~ updatePost ~ error:", error)
        }
    }

    const deletePost = async (data: PostModel) => {
        try {
            const { id, media } = data
            if (media && media.length > 0) {
                // delete media
                const tasks = media.map(item => deleteMedia(item.uri))
                await Promise.all(tasks)
            }
            // delete post
            await collection.doc(id).delete()
        } catch (error) {
            console.log("🚀 ~ file: usePost.tsx:151 ~ deletePost ~ error:", error)
        } finally {
            await getPost()
        }
    }

    const likeComment = async (postID: string) => {
        try {
            await collection
                .doc(postID)
                .update(data)
        } catch (error) {
            console.log("🚀 ~ file: usePost.tsx:133 ~ updatePost ~ error:", error)
        }
    }

    return { data, isLoading, collection, getPost, getPostByUserID, addPost, getPostNext, updatePost, deletePost, likeComment }
}

export default usePost