import { StoryModel } from "../../models/StoryModel"
import { FETCH_STORIES, CHANGE_LOADING_STORY_STATE, DELETE_IMAGE } from "../constants/story"
import { ActionType } from "../types"

export interface StoryState {
    stories: StoryModel[],
    loading: boolean,
}

const initialState: StoryState = {
    stories: [],
    loading: false
}

const story = (state: StoryState = initialState, action: ActionType) => {
    switch (action.type) {
        case FETCH_STORIES:
            return {
                ...state,
                stories: action.payload,
            }
        case CHANGE_LOADING_STORY_STATE:
            return {
                ...state,
                loading: action.payload,
            }
        case DELETE_IMAGE:
            if (action.payload.mode === 'update') {
                return {
                    ...state,
                    stories: state.stories.map(item => {
                        if (item.id === action.payload.storyData.id) {
                            return action.payload.storyData
                        }
                        return item
                    })
                }
            } else {
                return {
                    ...state,
                    stories: [...state.stories].filter(item => item.id !== action.payload.storyId)
                }
            }

        default:
            return state
    }
}

export default story