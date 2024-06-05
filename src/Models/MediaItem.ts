import { GiphyMedia } from "@giphy/react-native-sdk"

export type MediaItem = {
    uri: string,
    type: 'image' | 'video' | 'document' | any
}