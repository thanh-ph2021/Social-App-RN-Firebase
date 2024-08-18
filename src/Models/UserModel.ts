export interface UserModel {
    uid?: string
    notifyToken?: string,
    lname?: string,
    fname?: string,
    email?: string,
    userImg?: string,
    about?: string,
    phone?: string,
    country?: string,
    city?: string,
    followers?: string[],
    followings?: string[],
    bannerImg?: string,
    postTags?: string[]
}