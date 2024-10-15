import { firebase } from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

import { AppThunk } from '../types'
import { LIMIT } from '../../constants'
import { CHANGE_LOADING_STORY_STATE, FETCH_STORIES } from '../constants/story'
import { StoryModel } from '../../models/StoryModel'
import { MediaItem, UserModel } from '../../models'

const storiesCollection = firestore().collection('Stories')

export const fetchStories = (): AppThunk => async (dispatch, getState) => {
    try {
        const users = getState().userState.users
        await storiesCollection
            .orderBy('createdAt', 'desc')
            .limit(LIMIT)
            .get()
            .then((snapshot) => {
                let stories = snapshot.docs.map(doc => {
                    const data = doc.data()
                    const id = doc.id
                    const user = users.filter((user: UserModel) => user.uid === data.userId)[0]

                    return { id, ...data, 
                        userName: `${user?.lname} ${user?.fname}`, 
                        userImg: user.userImg
                    }
                })
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
        if(storyCurrentUser && storyCurrentUser.length > 0){
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
        dispatch({type: CHANGE_LOADING_STORY_STATE, payload: false})

    } catch (error) {
        console.log("🚀 ~ addStory ~ error:", error)
    }
}