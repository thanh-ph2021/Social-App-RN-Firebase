import { GiphyMedia } from "@giphy/react-native-sdk"

import { MediaItem } from "./MediaItem"
import { DocumentItem } from "./DocumentItem"
import { ChecklistModel } from "./ChecklistModel"

export interface PostModel {
    id: string,
    userID: string,
    // title post
    post: string,
    postTime: any,
    likes: LikeModel[],
    comments: CommentModel[],
    media?: MediaItem[],
    location: string,
    giphyMedias?: GiphyMedia[],
    docs?: DocumentItem[],
    checklistData?: ChecklistModel,
}

export interface LikeModel {
    type: string,
    userID: string
}

export interface CommentModel {
    text: string,
    userID: string,
    createAt: any,
    likes: LikeModel[],
    reply: CommentModel[]
}