import { useState, useEffect, useCallback } from 'react'
import { View, TouchableOpacity } from "react-native"
import moment from "moment"

import { SIZES, COLORS } from "../constants"
import { CommentModel, LikeModel } from '../models/PostModel'
import { Avatar, TextComponent } from "../components"
import { useAppDispatch, useAppSelector, useUser } from "../hooks"
import { UserModel } from '../models'
import { UtilIcons } from '../utils/icons'
import LikeButton from './Post/LikeButton'
import { updateComment } from '../redux/actions/post'
import { CommentLoader } from './Loader'

export type CommentCardProps = {
    commentData: CommentModel,
    postId: string,
    handleReply?: (userName: string) => void,
    seeReply?: () => void,
    isReply?: boolean,
    // comment data contains reply
    parentData?: CommentModel
}

const CommentCard = ({ commentData, postId, handleReply, seeReply, parentData }: CommentCardProps) => {

    const [userData, setUserData] = useState<UserModel>()
    const [data, setData] = useState<CommentModel>(commentData)
    const currentUser = useAppSelector(state => state.userState.currentUser)
    const dispatch = useAppDispatch()

    const { getUserFromHook } = useUser()

    useEffect(() => {
        setData(commentData)
    }, [commentData])

    useEffect(() => {
        const getUser = async () => {
            const user = await getUserFromHook(data.userID)
            if (user) {
                setUserData(user)
            }
        }

        getUser()
    }, [])

    const handleLike = useCallback(async (typeEmotion: string, isModal?: boolean) => {
        try {
            const copyLikes = data.likes ? [...data.likes] : []
            const userID = currentUser.uid
            const index = copyLikes.find(item => item.userID == userID)
            let newLikes: LikeModel[] = []

            if (index) {
                // liked
                if (isModal) {
                    // change like
                    const oldLikes = copyLikes.filter(item => item.userID != userID)
                    newLikes = [
                        ...oldLikes,
                        {
                            type: typeEmotion,
                            userID: userID
                        }
                    ]
                } else {
                    // dislike
                    newLikes = copyLikes.filter(item => item.userID != userID)
                }

            } else {
                // no like
                // add like
                newLikes = [
                    ...copyLikes,
                    {
                        type: typeEmotion,
                        userID: userID
                    }
                ]
            }

            const newComment = {
                ...commentData,
                likes: newLikes
            }

            setData(newComment)

            if (parentData) {
                // handle like for reply
                const newParentData = {
                    ...parentData,
                    reply: parentData.reply.map(reply => {
                        if (reply.id === newComment.id) {
                            return newComment
                        }

                        return reply
                    })
                }
                dispatch(updateComment(newParentData, postId))
            } else {
                dispatch(updateComment(newComment, postId))
            }

        } catch (error) {
            console.log("🚀 ~ handleLike ~ error:", error)
        }

    }, [data.likes])

    const renderTextComment = () => {

        const tag = getTagFromComment(data.text)

        return (
            <View style={{ flexDirection: 'row' }}>
                {tag && <TextComponent text={`${tag}`} color={COLORS.socialBlue} />}
                <TextComponent text={`${data.text.substring(tag ? tag.length : 0)}`} color={COLORS.socialWhite} />
            </View>

        )
    }

    const getTagFromComment = (text: string) => {
        if (text[0] === '@') {
            return text.split(' ')[0]
        }
    }

    return (
        <View>
            {!userData ? (<CommentLoader />) : (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', width: '90%' }}>
                        {
                            userData ? <Avatar source={{ uri: userData.userImg }} size='s' /> : <></>
                        }
                        <View style={{ marginLeft: SIZES.padding }}>
                            <View style={{ flexDirection: 'row' }}>
                                <TextComponent text={`${userData?.fname} ${userData?.lname}`} style={{ fontWeight: 'bold' }} color={COLORS.socialWhite} />
                                <TextComponent text={` - ${moment(data.createAt.toDate()).fromNow()}`} color={COLORS.lightGrey} />
                            </View>
                            {renderTextComment()}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: SIZES.base, width: 120 }}>
                                <LikeButton
                                    data={data.likes ?? []}
                                    handleLike={handleLike}
                                    containerStyle={{ alignSelf: 'flex-start', width: 60 }}
                                />
                                <TouchableOpacity onPress={() => handleReply && handleReply(`${userData?.fname}${userData?.lname}`)}>
                                    <UtilIcons.svgComment />
                                </TouchableOpacity>
                            </View>
                            {data.reply.length > 0 && seeReply && <TouchableOpacity onPress={seeReply} style={{ paddingVertical: SIZES.padding }}>
                                <TextComponent text={`${data.reply.length} replies`} color={COLORS.socialBlue} />
                            </TouchableOpacity>}
                        </View>
                    </View>
                </View>
            )}
        </View>
    )
}

export default CommentCard