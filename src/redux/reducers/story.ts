import { StoryModel } from "../../models/StoryModel"
import { FETCH_STORIES, CHANGE_LOADING_STORY_STATE } from "../constants/story"
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
        default:
            return state
    }
}

export default story