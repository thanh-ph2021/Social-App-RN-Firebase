import { memo } from "react"
import { ColorValue, Image, StyleSheet, TouchableOpacity, View } from "react-native"
import moment from "moment"

import { NotificationModel } from "../models/NotificationModel"
import { COLORS, images, SIZES, TypeEmotion, TypeNotification } from "../constants"
import Divider from "./Divider"
import TextComponent from "./TextComponent"
import { UtilIcons } from "../utils/icons"
import { selectPostById, selectUserByUID } from "../redux/selectors"
import { useAppDispatch, useAppSelector } from "../hooks"
import { PostModel, UserModel } from "../models"
import Avatar from "./Avatar"
import { markAsReadNoti } from "../redux/actions/notification"
import { fetchPostById } from "../redux/actions/post"

interface Props {
    data: NotificationModel,
    navigation: any
}

const NotificationCard = (props: Props) => {
    const { data, navigation } = props
    const senderUser: UserModel = useAppSelector(state => selectUserByUID(state, data.senderId))
    const post: PostModel | null = data.postId ? useAppSelector(state => selectPostById(state, data.postId)) : null
    const dispatch = useAppDispatch()

    const handlePress = async () => {
        if(post){

        } else {
            await dispatch(fetchPostById(data.postId))
        }
        switch (data.type) {
            case TypeNotification.Like: case TypeNotification.Comment:
            case TypeNotification.Angry: case TypeNotification.Care:
            case TypeNotification.Haha: case TypeNotification.Love:
            case TypeNotification.Sad: case TypeNotification.Wow:
                navigation.navigate('PostDetailScreen', { data: post ? post : {id: data.postId} })
                break
            case TypeNotification.Follow:
                navigation.navigate('Profile', { userID: data.senderId })
                break
        }

        dispatch(markAsReadNoti(data))
    }

    const renderIcon = () => {
        let Component, backgroundColor: ColorValue | undefined

        switch (data.type) {
            case TypeNotification.Like:
                Component = () => <Image source={images.like} style={styles.icon} />
                break
            case TypeNotification.Love:
                Component = () => <Image source={images.love} style={styles.icon} />
                break
            case TypeNotification.Care:
                Component = () => <Image source={images.care} style={styles.icon} />
                break
            case TypeNotification.Angry:
                Component = () => <Image source={images.angry} style={styles.icon} />
                break
            case TypeNotification.Haha:
                Component = () => <Image source={images.haha} style={styles.icon} />
                break
            case TypeNotification.Wow:
                Component = () => <Image source={images.wow} style={styles.icon} />
                break
            case TypeNotification.Sad:
                Component = () => <Image source={images.sad} style={styles.icon} />
                break
            case TypeNotification.Comment:
                Component = () => <UtilIcons.svgComment color={COLORS.socialWhite} size={15} />
                backgroundColor = COLORS.green
                break
            case TypeNotification.Follow:
                Component = () => <UtilIcons.svgUser color={COLORS.socialWhite} size={15} />
                backgroundColor = COLORS.socialPink
                break
            default:
                Component = () => <></>
        }

        return (
            <View style={[
                styles.containerIcon,
                { backgroundColor: backgroundColor ?? 'red' }
            ]}>
                <Component />
            </View>
        )
    }

    return (
        <TouchableOpacity onPress={handlePress}>
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: SIZES.padding }}>
                <View>
                    {senderUser.userImg
                        ? <Avatar source={{ uri: senderUser.userImg }} size={"xl"} onPress={() => {}} />
                        : <Avatar source={images.defaultImage} size={"s"} onPress={() => {}} />}

                    {renderIcon()}
                </View>

                <View style={{ width: '86%', paddingLeft: SIZES.padding }}>
                    <TextComponent
                        text={data.message}
                        color={data.isRead ? COLORS.lightGrey : COLORS.socialWhite}
                    />
                    <TextComponent color={COLORS.lightGrey} text={moment(data.createdAt.toDate()).fromNow()} />
                </View>
            </View>
            <Divider height={1} />
        </TouchableOpacity>
    )
}

export default memo(NotificationCard)

const styles = StyleSheet.create({
    containerIcon: {
        borderRadius: SIZES.padding,
        bottom: -5,
        right: -5,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        width: 20,
        height: 20,
    },
    icon: {
        width: 20,
        height: 20
    }
})