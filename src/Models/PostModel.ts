import { GiphyMedia } from "@giphy/react-native-sdk"

import { MediaItem } from "./MediaItem"
import { DocumentItem } from "./DocumentItem"
import { ChecklistModel } from "./ChecklistModel"

export interface PostModel {
    id?: string,
    userID: string,
    // title post
    post: string,
    postTime: any,
    likes: LikeModel[],
    comments: CommentModel[],
    commentCount: number,
    // media image - video | gyphic
    media?: MediaItem[] | any[],
    location: string | null,
    giphyMedias?: GiphyMedia[],
    docs?: DocumentItem[] | any[],
    checklistData: ChecklistModel | null,
}

export interface LikeModel {
    type: string,
    userID: string
}

export interface CommentModel {
    id?: string,
    text: string,
    userID: string,
    createAt: any,
    likes: LikeModel[],
    reply: CommentModel[]
}