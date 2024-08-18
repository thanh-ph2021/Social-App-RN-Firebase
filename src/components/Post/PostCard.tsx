import { useState, useEffect, memo, useCallback } from "react"
import { View, Text, Image, StyleSheet } from "react-native"
import { Alert } from "react-native"
import moment from 'moment'
import { TouchableWithoutFeedback } from "react-native-gesture-handler"
import { useNavigation } from "@react-navigation/native"
import { TouchableOpacity } from "@gorhom/bottom-sheet"

import { SIZES, images, FONTS, COLORS, SECOND_TO_MILISECOND, DAY_TO_SECOND, HOUR_TO_SECOND, MINUTE_TO_SECOND } from '../../constants'
import { LikeModel, OptionDataModel, PostModel, UserModel } from "../../models"
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

type PostCardProps = {
    item: PostModel,
    onDeletePost?: (item: PostModel) => void,
    onPressUserName?: (userID: string) => void,
}

const PostCard = ({ item, onDeletePost, onPressUserName }: PostCardProps) => {

    const [data, setData] = useState<PostModel>(item)
    const [voteResult, setVoteResult] = useState<{ total: number, checked: boolean, expired: boolean }>({ total: 0, checked: false, expired: false })
    const currentUser = useAppSelector(state => state.userState.currentUser)
    const userData: UserModel = useAppSelector(state => selectUserByUID(state, item.userID))
    const navigation = useNavigation<any>()
    const dispatch = useAppDispatch()
    const [tag, setTag] = useState(currentUser.postTags ? currentUser.postTags.includes(item.id!) : false)

    useEffect(() => {
        setData(item)
    }, [item, currentUser.postTags])

    useEffect(() => {
        if (data.checklistData) {
            const voteUsers = data.checklistData.optionDatas.map(option => option.voteUsers).flat()
            // know: user voted
            const checked = voteUsers.includes(currentUser.uid)

            // expired handle
            const now = Date.now().valueOf()  // miliseconds
            const limit = data.checklistData.timeLimit
            const convertLimitToSecond = Number(limit.day) * DAY_TO_SECOND + Number(limit.hour) * HOUR_TO_SECOND + Number(limit.minute) * MINUTE_TO_SECOND
            const postTimeLimitVote = (data.postTime.seconds + convertLimitToSecond) * SECOND_TO_MILISECOND // seconds * 1000 to miliseconds
            const timeRemain = postTimeLimitVote - now

            setVoteResult({ total: voteUsers.length, checked: checked, expired: timeRemain < 0 })

            if (timeRemain > 0) {
                const timeoutID = setTimeout(() => {
                    setVoteResult({ ...voteResult, expired: true })
                }, timeRemain)

                return () => clearTimeout(timeoutID)
            }
        }
    }, [data.checklistData])

    useEffect(() => {
        setTag(currentUser.postTags ? currentUser.postTags.includes(item.id!) : false)
    }, [currentUser.postTags])

    const handleDelete = () => {
        Alert.alert(
            'Delete post',
            'Are you sure',
            [
                {
                    text: 'Cancel',
                    onPress: () => { },
                    style: 'cancel'
                },
                {
                    text: 'Confirm',
                    onPress: () => onDeletePost && onDeletePost(item),
                }
            ],
            { cancelable: false }
        )
    }

    const gotoPostDetail = () => {
        navigation && navigation.navigate('PostDetailScreen', { data: data })
    }

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

            setData({
                ...item,
                likes: newLikes
            })

            dispatch(updatePost({
                ...item,
                likes: newLikes
            }))
        } catch (error) {
            console.log("🚀 ~ handleLike ~ error:", error)
        }

    }, [data.likes])

    const handleVote = async (option: OptionDataModel) => {
        try {
            const newState = { ...data }
            const uid = currentUser.uid

            if (newState.checklistData) {
                newState.checklistData = { ...newState.checklistData }

                newState.checklistData.optionDatas = newState.checklistData.optionDatas.map((item: OptionDataModel) => {
                    // voted
                    if (item.voteUsers.includes(uid)) {
                        return {
                            ...item,
                            voteNumbers: item.voteNumbers - 1,
                            voteUsers: item.voteUsers.filter(item => item !== uid)
                        }
                    }
                    // unvoted
                    if (item.id === option.id) {
                        return {
                            ...item,
                            voteNumbers: item.voteNumbers + 1,
                            voteUsers: [...item.voteUsers, userData.uid!]
                        }
                    }
                    return item
                })

                setData(newState)

                await updatePost(newState)
            }
        } catch (error) {
            console.log("🚀 ~ handleVote ~ error:", error)
        }
    }

    const onPressAvatar = () => {
        if (data.userID !== currentUser.uid && onPressUserName) {
            onPressUserName(data.userID)
        }
    }

    const onPressOptionPost = () => {

    }

    const renderChecklistData = () => {
        if (data.checklistData) {
            return (
                <View style={{ paddingHorizontal: SIZES.padding, gap: SIZES.base }}>
                    {data.checklistData.optionDatas.map(option => {
                        // know: vote position user
                        const checked = option.voteUsers?.includes(currentUser.uid)
                        const percent = voteResult.total > 0 ? option.voteUsers.length / voteResult.total * 100 : 0
                        return (
                            <View key={option.id}>
                                {voteResult.checked || voteResult.expired ? <View style={[
                                    styles.voteItem,
                                    {
                                        position: 'absolute',
                                        backgroundColor: checked ? COLORS.socialBlue : COLORS.lightGrey,
                                        height: '100%',
                                        width: `${percent}%`,
                                        opacity: 0.3
                                    }
                                ]} /> : <></>}
                                <TouchableOpacity
                                    style={[styles.voteItem, { borderColor: checked ? COLORS.socialBlue : COLORS.lightGrey, padding: SIZES.padding, }]}
                                    onPress={() => handleVote(option)}
                                    disabled={voteResult.expired}
                                >
                                    <TextComponent text={option.title} />
                                    {voteResult.checked || voteResult.expired ? <TextComponent text={`${percent}%`} /> : <></>}
                                </TouchableOpacity>

                            </View>

                        )
                    })}
                    {voteResult.checked || voteResult.expired ? <TextComponent text={`${voteResult.total} votes`} /> : <></>}
                </View>
            )
        }
    }

    const onTag = () => {
        setTag(!tag)

        const postTags = currentUser.postTags

        if (postTags && postTags.includes(item.id!)) {
            dispatch(updateUser({
                ...currentUser,
                postTags: postTags.filter((elem: string) => elem !== item.id!)
            }))
        } else {
            dispatch(updateUser({
                ...currentUser,
                postTags: postTags ? [...postTags, item.id!] : [item.id!]
            }))
        }

    }

    return (
        <View>
            {/* header */}
            <View>
                {userData ? <View style={styles.titleContainer}>
                    <TouchableWithoutFeedback onPress={onPressAvatar}>
                        {userData ? (
                            <Image source={{ uri: userData.userImg }} style={styles.avatar} />
                        ) : (
                            <Image source={images.defaultImage} style={styles.avatar} />
                        )}
                    </TouchableWithoutFeedback>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                        <View style={styles.textWrap}>
                            {/* <TouchableOpacity onPress={() => onPressUserName && onPressUserName(item.userID)}> */}
                            <Text style={[styles.text, { fontWeight: 'bold' }]}>{userData.fname} {userData.lname}</Text>
                            {/* </TouchableOpacity> */}
                            <Text style={[styles.text, { ...FONTS.body4, color: COLORS.lightGrey }]}>{moment(data.postTime.toDate()).fromNow()}</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={onPressOptionPost}>
                        <UtilIcons.svgDotsVertical />
                    </TouchableOpacity>

                </View> : <></>}
            </View>

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