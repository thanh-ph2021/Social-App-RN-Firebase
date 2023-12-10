import { ImageSourcePropType } from "react-native";

export interface PostModel {
    id: string,
    userID: string,
    // title post
    post: string,
    postTime: any,
    likes: number,
    comments: number,
    postImg?: string,
}