import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage'

import { ADD_COMMENT_POST, ADD_POST, LOAD_COMMENTS_POST, UPDATE_COMMENT_POST, UPDATE_POST, USER_POSTS_STATE_CHANGE } from '../constants'
import { LIMIT } from '../../constants'
import { CommentModel, PostModel } from '../../models'
import { AppThunk } from '../types'

const postCollection = firestore().collection('Posts')

export const fetchPosts = (): AppThunk => async (dispatch, getState) => {
    try {
        await postCollection
            .where('scope', '==', 'public')
            .orderBy('postTime', 'desc')
            .limit(LIMIT)
            .get()
            .then((snapshot) => {
                let posts = snapshot.docs.map(doc => {
                    const data = doc.data()
                    const id = doc.id

                    return { id, ...data }
                })
                dispatch({ type: USER_POSTS_STATE_CHANGE, payload: posts })
            })
    } catch (error) {
        console.log("🚀 ~ fetchPost ~ error:", error)
    }
}

export const fetchPostById = (postId: string): AppThunk => async (dispatch, getState) => {
    try {
        const postIds = getState().userState.posts.map((post: PostModel) => post.id)
        if (postIds.includes(postId)) {
            return
        }
        
        await postCollection
            .doc(postId)
            .get()
            .then((snapshot) => {
                const post = { ...snapshot.data(), id: snapshot.id }
                dispatch({ type: ADD_POST, payload: post })
            })
    } catch (error) {
        console.log("🚀 ~ fetchPost ~ error:", error)
    }
}

export const addPost = (postData: PostModel): AppThunk => async (dispatch) => {
    try {
        await postCollection
            .add(postData)

        dispatch(fetchPosts())
    } catch (error) {
        console.log("🚀 ~ addPost ~ error:", error)
    }
}

export const fetchNextPosts = (): AppThunk => async (dispatch, getState) => {
    try {
        const data = getState()
        const posts = data.userState.posts
        if (posts.length > 0) {
            await postCollection
                .where('scope', '==', 'public')
                .orderBy('postTime', 'desc')
                .startAfter(posts[posts.length - 1].postTime)
                .limit(LIMIT)
                .get()
                .then((snapshot) => {
                    let nextPosts = snapshot.docs.map(doc => {
                        const data = doc.data()
                        const id = doc.id

                        return { id, ...data }
                    })
                    if (nextPosts.length > 0) {
                        dispatch({ type: USER_POSTS_STATE_CHANGE, payload: [...posts, ...nextPosts] })
                    }
                })
        }
    } catch (error) {
        console.log("🚀 ~ fetchNextPosts ~ error:", error)
    }
}

export const updatePost = (postData: PostModel): AppThunk => async (dispatch) => {
    try {
        // remove comment post because save comment via collection comments
        const removeCommentPost = { ...postData, comments: [] }
        await postCollection
            .doc(postData.id)
            .update(removeCommentPost)

        dispatch({ type: UPDATE_POST, payload: postData })
    } catch (error) {
        console.log("🚀 ~ updatePost ~ error:", error)
    }
}

export const deleteMedia = async (uri: string) => {
    try {
        const storageRef = storage().refFromURL(uri)
        const mediaRef = storage().ref(storageRef.fullPath)

        await mediaRef.delete()
    } catch (error) {
        console.log("🚀 ~ deleteMedia ~ error:", error)
    }
}

export const deletePost = (postData: PostModel): AppThunk => async (dispatch) => {
    try {
        const { id, media, docs } = postData
        if (media && media.length > 0) {
            // delete media
            const tasks = media.map(item => deleteMedia(item.uri))
            await Promise.all(tasks)
        }

        if (docs && docs.length > 0) {
            // delete media
            const tasks = docs.map(item => deleteMedia(item.url))
            await Promise.all(tasks)
        }
        // delete post
        await postCollection.doc(id).delete()
        dispatch(fetchPosts())
    } catch (error) {
        console.log("🚀 ~ deletePost ~ error:", error)
    }
}

export const addComment = (commentData: CommentModel, postId: string): AppThunk => async (dispatch) => {
    try {

        const postReference = postCollection.doc(postId)

        return firestore().runTransaction(async transaction => {
            const postSnapshot = await transaction.get(postReference)

            await postCollection
                .doc(postId)
                .collection('comments')
                .add(commentData)

            if (postSnapshot.exists) {
                transaction.update(postReference, {
                    commentCount: postSnapshot.data()!.commentCount + 1
                })
            }

            dispatch({ type: ADD_COMMENT_POST, payload: { postId: postId, commentData: commentData } })
        })


    } catch (error) {
        console.log("🚀 ~ addComment ~ error:", error)
    }
}

export const loadComments = (postId: string): AppThunk => async (dispatch) => {
    try {

        await postCollection
            .doc(postId)
            .collection('comments')
            .orderBy('createAt', 'asc')
            .get()
            .then((snapshot) => {
                let comments = snapshot.docs.map(doc => {
                    const data = doc.data()
                    const id = doc.id

                    return { id, ...data }
                })
                if (comments.length > 0) {
                    dispatch({ type: LOAD_COMMENTS_POST, payload: { postId: postId, comments: comments } })
                }
            })

    } catch (error) {
        console.log("🚀 ~ loadComments ~ error:", error)
    }
}

export const updateComment = (commentData: CommentModel, postId: string): AppThunk => async (dispatch) => {
    try {

        await postCollection
            .doc(postId)
            .collection('comments')
            .doc(commentData.id)
            .update(commentData)

        dispatch({ type: UPDATE_COMMENT_POST, payload: { postId: postId, commentData: commentData } })

    } catch (error) {
        console.log("🚀 ~ updateComment ~ error:", error)
    }
}

export const searchPosts = async (textSearch: string, type?: 'image' | 'video') => {
    try {
        const posts: PostModel[] = await postCollection
            .get()
            .then(snapshot => {
                let posts = snapshot.docs.map(doc => {
                    const data: any = doc.data()
                    const id = doc.id

                    return { id, ...data }
                })

                if (type) {
                    return posts.filter((post: PostModel) => {
                        const postTitle = post.post.toLowerCase()
                        const medias = post.media ? post.media.map(media => media.type) : []

                        return postTitle.includes(textSearch.toLowerCase()) && medias.includes(type)
                    })
                }

                return posts.filter((post: PostModel) => {
                    const postTitle = post.post.toLowerCase()
                    return postTitle.includes(textSearch.toLowerCase())
                })
            })

        return posts

    } catch (error) {
        console.log("🚀 ~ searchPosts ~ error:", error)
    }
}