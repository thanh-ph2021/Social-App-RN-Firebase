import { useState, useEffect, memo, useCallback } from "react"
import { View, Text, Image, StyleSheet } from "react-native"
import { Alert } from "react-native"
import moment from 'moment'
import { TouchableWithoutFeedback } from "react-native-gesture-handler"
import { useNavigation } from "@react-navigation/native"
import { TouchableOpacity } from "@gorhom/bottom-sheet"
import firestore from '@react-native-firebase/firestore'

import { SIZES, images, FONTS, COLORS, SECOND_TO_MILISECOND, DAY_TO_SECOND, HOUR_TO_SECOND, MINUTE_TO_SECOND } from '../../constants'
import { ChecklistModel, LikeModel, OptionDataModel, PostModel, TimeLimitModel, UserModel } from "../../models"
import MediaGridCollapse from "../MediaGridCollapse"
import { useAppDispatch, useAppSelector } from "../../hooks"
import LikeButton from "./LikeButton"
import { UtilIcons } from "../../utils/icons"
import Icon, { TypeIcons } from "../Icon"
import TextComponent from "../TextComponent"
import DocumentGrid from "../DocumentGrid"
import MediaViewSample from "../Giphy/MediaViewSample"
import { updatePost } from "../../redux/actions/post"
import { selectUserByUID } from "../../redux/selectors"
import { updateUser } from "../../redux/actions/user"
import { shallowEqual } from "react-redux"
import { addNotification } from "../../redux/actions/notification"

type PostCardProps = {
    item: PostModel,
    onDeletePost?: (item: PostModel) => void,
    onPressUserName?: (userID: string) => void,
}

const PostCard = ({ item, onDeletePost, onPressUserName }: PostCardProps) => {

    const [data, setData] = useState<PostModel>(item)
    const [voteResult, setVoteResult] = useState({ total: 0, checked: false, expired: false })
    const currentUser = useAppSelector(state => state.userState.currentUser, shallowEqual)
    const userCreatePost: UserModel = useAppSelector(state => selectUserByUID(state, item.userID), shallowEqual)
    const navigation = useNavigation<any>()
    const dispatch = useAppDispatch()
    const [tag, setTag] = useState(currentUser.postTags?.includes(item.id!) ?? false)
    const likeNoti = useAppSelector(state => state.asyncstorageState.likeNoti)

    useEffect(() => {
        if (data !== item) {
            setData(item)
        }
        setTag(currentUser.postTags?.includes(item.id!) ?? false)
    }, [item, currentUser.postTags])

    useEffect(() => {
        if (data.checklistData) {
            handleVoteResult(data.checklistData, data.postTime.seconds)
        }
    }, [data.checklistData])

    const handleVoteResult = (checkListData: ChecklistModel, postTimeSeconds: number) => {
        const voteUsers = checkListData.optionDatas.flatMap(option => option.voteUsers)
        const checked = voteUsers.includes(currentUser.uid)
        const timeRemain = calculateTimeRemain(checkListData.timeLimit, postTimeSeconds)

        setVoteResult({ total: voteUsers.length, checked, expired: timeRemain < 0 })

        if (timeRemain > 0) {
            const timeoutID = setTimeout(() => {
                setVoteResult(prev => ({ ...prev, expired: true }))
            }, timeRemain)

            return () => clearTimeout(timeoutID)
        }
    }

    const calculateTimeRemain = (limit: TimeLimitModel, postTimeSeconds: number) => {
        const convertLimitToSecond = Number(limit.day) * DAY_TO_SECOND + Number(limit.hour) * HOUR_TO_SECOND + Number(limit.minute) * MINUTE_TO_SECOND
        const postTimeLimitVote = (postTimeSeconds + convertLimitToSecond) * SECOND_TO_MILISECOND // seconds * 1000 to miliseconds
        return postTimeLimitVote - Date.now().valueOf()
    }

    const handleDelete = () => {
        Alert.alert('Delete post', 'Are you sure', [
            { text: 'Cancel', onPress: () => { }, style: 'cancel' },
            { text: 'Confirm', onPress: () => onDeletePost && onDeletePost(item) }
        ])
    }

    const gotoPostDetail = () => {
        navigation && navigation.navigate('PostDetailScreen', { data })
    }

    const handleLike = useCallback(async (typeEmotion: string, isModal?: boolean) => {
        const newLikes = updateLike(data.likes, typeEmotion, currentUser.uid, isModal)
        setData({ ...data, likes: newLikes })
    
        dispatch(updatePost({ ...item, likes: newLikes }))
    }, [data])

    const updateLike = (likes: LikeModel[] = [], typeEmotion: string, userID: string, isModal?: boolean) => {
        const likeIndex = likes.find(item => item.userID === userID)
        if (likeIndex) {
            if (isModal) {
                // change like
                addNoti(typeEmotion)

                return likes.map(item => item.userID === userID ? { ...item, type: typeEmotion } : item)
            } else {
                // dislike
                return likes.filter(item => item.userID !== userID)
            }
        }
        addNoti(typeEmotion)


        return [...likes, { type: typeEmotion, userID }]
    }

    const addNoti = (typeEmotion: string) => {
        if (userCreatePost.uid != currentUser.uid && likeNoti) {
            const message = typeEmotion.toLowerCase() == 'like'
                ? `${currentUser.fname} ${currentUser.lname} liked your post`
                : `${currentUser.fname} ${currentUser.lname} reacted to your post`

            dispatch(addNotification({
                createdAt: firestore.Timestamp.fromDate(new Date()),
                isRead: false,
                message: message,
                postId: item.id!,
                receiverId: userCreatePost.uid!,
                senderId: currentUser.uid,
                type: typeEmotion.toLowerCase(),
            }))
        }
    }

    const handleVote = useCallback(async (option: OptionDataModel) => {
        try {
            const newState = { ...data }
            const uid = currentUser.uid

            if (newState.checklistData) {
                newState.checklistData = { ...newState.checklistData }

                newState.checklistData.optionDatas = newState.checklistData.optionDatas.map((item: OptionDataModel) => {
                    // unvoted option end-user chose
                    if (item.voteUsers.includes(uid)) {
                        return {
                            ...item,
                            voteNumbers: item.voteNumbers - 1,
                            voteUsers: item.voteUsers.filter(item => item !== uid)
                        }
                    }
                    // voted option end-user
                    if (item.id === option.id) {
                        return {
                            ...item,
                            voteNumbers: item.voteNumbers + 1,
                            voteUsers: [...item.voteUsers, uid]
                        }
                    }
                    return item
                })
                await dispatch(updatePost(newState))
            }
        } catch (error) {
            console.log("🚀 ~ handleVote ~ error:", error)
        }
    }, [data])

    const onPressAvatar = () => {
        if (data.userID !== currentUser.uid && onPressUserName) {
            onPressUserName(data.userID)
        }
    }

    const onPressOptionPost = () => {

    }

    const renderChecklistData = () => {
        return data.checklistData ? (
            <View style={{ paddingHorizontal: SIZES.padding, gap: SIZES.base }}>
                {data.checklistData.optionDatas.map(option => renderOption(option))}
                {voteResult.checked || voteResult.expired ? <TextComponent text={`${voteResult.total} votes`} /> : <></>}
            </View>
        ) : <></>
    }

    const renderOption = (option: OptionDataModel) => {
        const checked = option.voteUsers?.includes(currentUser.uid)
        const percent = voteResult.total > 0 ? (option.voteUsers.length / voteResult.total) * 100 : 0
        return (
            <View key={option.id}>
                {voteResult.checked || voteResult.expired ? (
                    <View
                        style={[
                            styles.voteItem,
                            {
                                height: '100%',
                                position: 'absolute',
                                backgroundColor: checked ? COLORS.socialBlue : COLORS.lightGrey,
                                width: `${percent}%`,
                                opacity: 0.3,
                            }
                        ]}
                    />
                ) : <></>}
                <TouchableOpacity
                    style={[styles.voteItem, { borderColor: checked ? COLORS.socialBlue : COLORS.lightGrey, padding: SIZES.padding }]}
                    onPress={() => handleVote(option)}
                    disabled={voteResult.expired}
                >
                    <TextComponent text={option.title} />
                    {voteResult.checked || voteResult.expired ? <TextComponent text={`${percent.toFixed(0)}%`} /> : <></>}
                </TouchableOpacity>
            </View>
        )
    }

    const onTag = () => {
        const newTag = toggleTag(currentUser.postTags, item.id!)
        dispatch(updateUser({ ...currentUser, postTags: newTag }))
        setTag(!tag)
    }

    const toggleTag = (postTags: string[] = [], postID: string) => {
        return postTags.includes(postID) ? postTags.filter(tag => tag !== postID) : [...postTags, postID]
    }

    return (
        <View>
            {/* header */}
            {userCreatePost
                ? <View style={styles.titleContainer}>
                    <TouchableWithoutFeedback onPress={onPressAvatar}>
                        {userCreatePost.userImg ? (
                            <Image source={{ uri: userCreatePost.userImg }} style={styles.avatar} />
                        ) : (
                            <Image source={images.defaultImage} style={styles.avatar} />
                        )}
                    </TouchableWithoutFeedback>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                        <View style={styles.textWrap}>
                            <Text style={[styles.text, { fontWeight: 'bold' }]}>{userCreatePost.fname} {userCreatePost.lname}</Text>
                            <Text style={[styles.text, { ...FONTS.body4, color: COLORS.lightGrey }]}>{moment(data.postTime.toDate()).fromNow()}</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={onPressOptionPost}>
                        <UtilIcons.svgDotsVertical />
                    </TouchableOpacity>
                </View>
                : <></>
            }


            {/* location */}
            {data.location && (
                <View style={{ flexDirection: 'row', paddingHorizontal: SIZES.base, paddingTop: SIZES.base, alignItems: 'center' }}>
                    <Icon type={TypeIcons.Ionicons} name='location-sharp' size={SIZES.icon} color={COLORS.lightGrey} />
                    <TextComponent style={{ color: COLORS.lightGrey, flex: 1, paddingHorizontal: SIZES.base }} text={data.location} />
                </View>
            )}

            {/* title */}
            <View style={{ marginHorizontal: SIZES.padding, marginVertical: SIZES.padding }}>
                {data.post && <TextComponent style={[styles.text]} text={data.post} />}
            </View>

            {/* image post */}
            {data.media && <MediaGridCollapse media={data.media} onPressImage={(media) => gotoPostDetail()} />}
            {data.giphyMedias && data.giphyMedias.length > 0 && (
                <View style={[{ height: 250, width: SIZES.width, alignSelf: 'center' }, { aspectRatio: data.giphyMedias[0].aspectRatio }]}>
                    <MediaViewSample media={data.giphyMedias[0]} />
                </View>
            )}

            {/* documents */}
            {data.docs && (
                <View style={{ paddingHorizontal: SIZES.padding }}>
                    <DocumentGrid documentArray={data.docs} />
                </View>
            )}

            {/* checklist */}
            {renderChecklistData()}

            {/* button */}
            <View style={styles.buttonContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '45%' }}>
                    {/* likes button */}
                    <LikeButton
                        data={data.likes ?? []}
                        handleLike={handleLike}
                    />
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => gotoPostDetail()}>
                        <UtilIcons.svgComment />
                        <TextComponent text={`${item.commentCount ? item.commentCount : item.comments ? item.comments.length : 0}`} style={{ paddingLeft: SIZES.base }} />
                    </TouchableOpacity>
                    <UtilIcons.svgShare />
                </View>
                <TouchableOpacity style={{ alignItems: 'flex-end' }} onPress={onTag}>
                    <UtilIcons.svgBookmark fill={tag ? COLORS.socialBlue : undefined} />
                </TouchableOpacity>
            </View>
        </View>
    )
}


export default memo(PostCard)

const styles = StyleSheet.create({

    cardContainer: {
        flex: 1,
    },

    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: SIZES.padding,
    },

    textWrap: {
        paddingLeft: SIZES.base
    },

    avatar: {
        width: 32,
        height: 32,
        borderRadius: 60,
    },

    image: {
        width: '100%',
        height: 250,
    },

    text: {
        color: COLORS.white,
        ...FONTS.body3
    },

    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: SIZES.padding,
    },

    voteItem: {
        borderRadius: SIZES.base,
        borderWidth: 1,
        justifyContent: 'space-between',
        flexDirection: 'row',
    }
})