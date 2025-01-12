import { firebase } from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

import { AppThunk } from '../types'
import { LIMIT } from '../../constants'
import { CHANGE_LOADING_STORY_STATE, DELETE_IMAGE, FETCH_STORIES } from '../constants/story'
import { StoryModel } from '../../models/StoryModel'
import { MediaItem, UserModel } from '../../models'
import { deleteMedia } from './post'

const storiesCollection = firestore().collection('Stories')

export const fetchStories = (): AppThunk => async (dispatch, getState) => {
    try {
        const users = getState().userState.users
        const currentUser = getState().userState.currentUser

        await storiesCollection
            .orderBy('createdAt', 'desc')
            .limit(LIMIT)
            .get()
            .then((snapshot) => {
                let stories = snapshot.docs.map(doc => {
                    const data = doc.data()
                    const id = doc.id
                    const user = users.filter((user: UserModel) => user.uid === data.userId)[0]

                    return {
                        id, ...data,
                        userName: `${user?.lname} ${user?.fname}`,
                        userImg: user.userImg,
                        userId: data.userId
                    }
                })

                let index = stories.findIndex(story => story.userId === currentUser.uid)

                if(index !== -1){
                    let targetStory = stories.splice(index, 1)[0]
                    stories.unshift(targetStory)
                }

                dispatch({ type: FETCH_STORIES, payload: stories })
            })
    } catch (error) {
        console.log("🚀 ~ fetchStories ~ error:", error)
    }
}

export const addStory = (media: MediaItem): AppThunk => async (dispatch, getState) => {
    try {
        const uid = firebase.auth().currentUser!.uid
        const timestamp = firestore.Timestamp.fromDate(new Date())
        let date = timestamp.toDate()
        date.setHours(date.getHours() + 24)

        const storyCurrentUser = getState().storyState.stories.filter((item: StoryModel) => item.userId == uid)
        if (storyCurrentUser && storyCurrentUser.length > 0) {
            const story = storyCurrentUser[0]
            const dataStory = [media, ...story.data]
            await storiesCollection.doc(story.id!).update({
                data: dataStory,
                expiresAt: firestore.Timestamp.fromDate(date),
                createdAt: timestamp
            })
        } else {
            const story: StoryModel = {
                data: [
                    media
                ],
                createdAt: timestamp,
                userId: uid,
                viewers: [],
                expiresAt: firestore.Timestamp.fromDate(date)
            }
            await storiesCollection
                .add(story)
        }

        dispatch(fetchStories())
        dispatch({ type: CHANGE_LOADING_STORY_STATE, payload: false })

    } catch (error) {
        console.log("🚀 ~ addStory ~ error:", error)
    }
}

export const deleteImage = (storyData: StoryModel, indexImage: number): AppThunk => async (dispatch, getState) => {
    try {
        const dataImages = [...storyData.data]
        if (dataImages.length > 1) {
            const deleteData = dataImages.splice(indexImage, 1)
            await storiesCollection
                .doc(storyData.id!)
                .update({ data: dataImages })

            deleteMedia(deleteData[0].uri)
            dispatch({ type: DELETE_IMAGE, payload: { mode: 'update', storyData: { ...storyData, data: dataImages } } })
        } else {
            await storiesCollection
                .doc(storyData.id!)
                .delete()

            deleteMedia(storyData.data[0].uri)
            dispatch({ type: DELETE_IMAGE, payload: { mode: 'delete', storyId: storyData.id! } })
        }

    } catch (error) {
        console.log("🚀 ~ deleteImage ~ error:", error)
    }
}