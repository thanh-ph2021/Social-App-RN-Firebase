import { MediaItem } from "./MediaItem";

export interface StoryModel {
    id?: string,
    userId: string,
    userName?: string,
    userImg?: string,
    createdAt: any,
    expiresAt: any,
    viewers: string[],
    data: MediaItem[],
}