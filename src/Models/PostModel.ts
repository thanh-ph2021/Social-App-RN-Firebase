import { MediaItem } from "./MediaItem";

export interface PostModel {
    id: string,
    userID: string,
    // title post
    post: string,
    postTime: any,
    likes: LikeModel[],
    comments: CommentModel[],
    media?: MediaItem[],
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