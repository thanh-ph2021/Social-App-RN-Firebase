import { useState, useEffect, memo, useRef, useCallback } from "react"
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, TouchableHighlight } from "react-native"
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { SIZES, images, FONTS, COLORS, TypeEmotion } from '../../constants'
import { LikeModel, PostModel, UserModel } from "../../models"
import useAuthContext from "../../hooks/useAuthContext"
import { Alert } from "react-native"
import moment from 'moment'
import ProgressiveImage from "../ProgressiveImage"
import { getUser, showNotification } from "../../utils"
import Icon, { TypeIcons } from "../Icon"
import { TouchableWithoutFeedback } from "react-native-gesture-handler"
import MediaGridCollapse from "../MediaGridCollapse"
import { usePost } from "../../hooks"
import { useNavigation } from "@react-navigation/native"
import { utilStyles } from "../../styles"
import IconEmotionGroup from "./IconEmotionGroup"
import LikeButton from "./LikeButton"
import { UtilIcons } from "../../utils/icons"

type PostCardProps = {
    item: PostModel,
    onDeletePost?: (item: PostModel) => void,
    onPressUserName?: (userID: string) => void,
}

const PostCard = ({ item, onDeletePost, onPressUserName }: PostCardProps) => {

    const [likes, setLikes] = useState<LikeModel[]>(item.likes ?? [])
    const [userData, setUserData] = useState<UserModel>()
    const { user } = useAuthContext()
    const navigation = useNavigation<any>()

    const { updatePost, deletePost } = usePost()

    useEffect(() => {
        getUser(item.userID, setUserData)
    }, [])

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

    return (
        <View>
            {/* header */}
            <TouchableWithoutFeedback onPress={() => console.log('clicked title')}>
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
                            <Text style={[styles.text, { ...FONTS.body4, color: COLORS.lightGrey }]}>{moment(item.postTime.toDate()).fromNow()}</Text>
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

            {/* title */}
            <View style={{ marginHorizontal: SIZES.padding, marginVertical: SIZES.padding }}>
                {item.post && <Text style={[styles.text]}>{item.post}</Text>}
            </View>


            {/* image post */}
            {item.media && <MediaGridCollapse media={item.media} onPressImage={(media) => gotoPostDetail()} />}

            {/* Like number */}
            {/* {likes.length > 0 ? (
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: SIZES.padding, paddingTop: SIZES.base }}>
                    <IconEmotionGroup emotionData={likes.map(item => item.type)} />
                    <Text style={{ ...FONTS.body3, marginLeft: SIZES.base, color: COLORS.socialWhite }}>{likes.length}</Text>
                </TouchableOpacity>
            ) : <></>} */}

            {/* button */}
            <View style={styles.buttonContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                    {/* likes button */}
                    <LikeButton
                        data={likes && likes.filter(item => item.userID == user?.uid).map(item => item.type)}
                        handleLike={handleLike}
                    />
                    <View style={{ flexDirection: 'row' }}>
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
        marginTop: SIZES.padding * 2
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
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: SIZES.padding,
    },
})