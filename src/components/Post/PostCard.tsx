import { useState, useEffect, memo } from "react"
import { View, Text, Image, StyleSheet } from "react-native"
import { Alert } from "react-native"
import moment from 'moment'
import { TouchableWithoutFeedback } from "react-native-gesture-handler"
import { useNavigation } from "@react-navigation/native"
import { TouchableOpacity } from "@gorhom/bottom-sheet"

import { SIZES, images, FONTS, COLORS, SECOND_TO_MILISECOND, DAY_TO_SECOND, HOUR_TO_SECOND, MINUTE_TO_SECOND } from '../../constants'
import { LikeModel, OptionDataModel, PostModel, UserModel } from "../../models"
import useAuthContext from "../../hooks/useAuthContext"
import { getUser } from "../../utils"
import MediaGridCollapse from "../MediaGridCollapse"
import { usePost } from "../../hooks"
import LikeButton from "./LikeButton"
import { UtilIcons } from "../../utils/icons"
import Icon, { TypeIcons } from "../Icon"
import TextComponent from "../TextComponent"
import { MediaViewSample } from "../Giphy/MediaViewSample"
import DocumentGrid from "../DocumentGrid"

type PostCardProps = {
    item: PostModel,
    onDeletePost?: (item: PostModel) => void,
    onPressUserName?: (userID: string) => void,
}


const PostCard = ({ item, onDeletePost, onPressUserName }: PostCardProps) => {

    const [data, setData] = useState<PostModel>(item)
    const [voteResult, setVoteResult] = useState<{ total: number, checked: boolean, expired: boolean }>({ total: 0, checked: false, expired: false })
    const [likes, setLikes] = useState<LikeModel[]>(item.likes ?? [])
    const [userData, setUserData] = useState<UserModel>()
    const { user } = useAuthContext()
    const navigation = useNavigation<any>()

    const { updatePost, deletePost } = usePost()

    useEffect(() => {
        getUser(item.userID, setUserData)
    }, [])

    useEffect(() => {
        if (data.checklistData) {
            const voteUsers = data.checklistData.optionDatas.map(option => option.voteUsers).flat()
            // know: user voted
            const checked = voteUsers.includes(user!.uid!)

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
        navigation && navigation.navigate('PostDetailScreen', { data: item })
    }

    const handleLike = async (typeEmotion: string, isModal?: boolean) => {
        try {
            const copyLikes = likes ? [...likes] : []
            const userID = user?.uid!
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
                            userID: user?.uid ?? 'unknow'
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
                        userID: user?.uid ?? 'unknow'
                    }
                ]
            }

            setLikes(newLikes)
            await updatePost({
                ...item,
                likes: newLikes
            })
        } catch (error) {
        }
    }

    const handleVote = async (option: OptionDataModel) => {
        try {
            const newState = { ...data }
            const uid = user!.uid!

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
                            voteUsers: [...item.voteUsers, user!.uid!]
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

    const renderChecklistData = () => {
        if (data.checklistData) {
            return (
                <View style={{ paddingHorizontal: SIZES.padding, gap: SIZES.base }}>
                    {data.checklistData.optionDatas.map(option => {
                        // know: vote position user
                        const checked = option.voteUsers?.includes(user!.uid!)
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

    return (
        <View>
            {/* header */}
            <TouchableWithoutFeedback onPress={() => onPressUserName && onPressUserName(data.userID)}>
                <View style={styles.titleContainer}>
                    {userData ? (
                        <Image source={{ uri: userData?.userImg }} style={styles.avatar} />
                    ) : (
                        <Image source={images.defaultImage} style={styles.avatar} />
                    )}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                        <View style={styles.textWrap}>
                            {/* <TouchableOpacity onPress={() => onPressUserName && onPressUserName(item.userID)}> */}
                            <Text style={[styles.text, { fontWeight: 'bold' }]}>{userData?.fname} {userData?.lname}</Text>
                            {/* </TouchableOpacity> */}
                            <Text style={[styles.text, { ...FONTS.body4, color: COLORS.lightGrey }]}>{moment(data.postTime.toDate()).fromNow()}</Text>
                        </View>
                        {/* delete button */}
                        {/* {user && user.uid == item.userID
                            ? (
                                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={handleDelete}>
                                    <Icon type={TypeIcons.Feather} name='x' color={COLORS.black} size={SIZES.icon} />
                                </TouchableOpacity>
                            )
                            : <></>} */}
                    </View>
                    <UtilIcons.svgDotsVertical />
                </View>
            </TouchableWithoutFeedback>

            {/* location */}
            {data.location && (
                <View style={{ flexDirection: 'row', paddingHorizontal: SIZES.base, paddingTop: SIZES.base, alignItems: 'center' }}>
                    <Icon type={TypeIcons.Ionicons} name='location-sharp' size={SIZES.icon} color={COLORS.lightGrey} />
                    <TextComponent style={{ color: COLORS.lightGrey, flex: 1, paddingHorizontal: SIZES.base }} text={data.location} />
                </View>
            )}


            {/* title */}
            <View style={{ marginHorizontal: SIZES.padding, marginVertical: SIZES.padding }}>
                {data.post && <Text style={[styles.text]}>{data.post}</Text>}
            </View>


            {/* image post */}
            {data.media && <MediaGridCollapse media={data.media} onPressImage={(media) => gotoPostDetail()} />}
            {data.giphyMedias && (
                <View style={[{ height: 250, width: SIZES.width, alignSelf: 'center' }, { aspectRatio: data.giphyMedias[0].aspectRatio }]}>
                    <MediaViewSample media={data.giphyMedias[0]} />
                </View>
            )}

            {data.docs && (
                <View style={{ paddingHorizontal: SIZES.padding }}>
                    <DocumentGrid documentArray={data.docs} />
                </View>
            )}

            {renderChecklistData()}

            {/* Like number */}
            {/* {likes.length > 0 ? (
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: SIZES.padding, paddingTop: SIZES.base }}>
                    <IconEmotionGroup emotionData={likes.map(item => item.type)} />
                    <Text style={{ ...FONTS.body3, marginLeft: SIZES.base, color: COLORS.socialWhite }}>{likes.length}</Text>
                </TouchableOpacity>
            ) : <></>} */}

            {/* button */}
            <View style={styles.buttonContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, alignItems: 'center' }}>
                    {/* likes button */}
                    <LikeButton
                        data={likes && likes.filter(item => item.userID == user?.uid).map(item => item.type)}
                        handleLike={handleLike}
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <UtilIcons.svgComment />
                        <Text style={[styles.text, { paddingLeft: SIZES.base }]}>1</Text>
                    </View>
                    <UtilIcons.svgShare />
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <UtilIcons.svgBookmark />
                </View>
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