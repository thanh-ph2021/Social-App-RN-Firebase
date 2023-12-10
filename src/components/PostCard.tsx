import { useState, useEffect } from "react"
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native"
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { SIZES, images, FONTS, COLORS } from '../constants'
import { PostModel, UserModel } from "../Models"
import useAuthContext from "../hooks/useAuthContext"
import { Alert } from "react-native"
import moment from 'moment'
import ProgressiveImage from "./ProgressiveImage"
import { getUser } from "../utils"

type PostCardProps = {
    item: PostModel,
    onDelete: (id: string) => void,
    onPress?: () => void
}

const Divider = () => {
    return (
        <View style={{ height: 0.3, backgroundColor: COLORS.gray, width: '80%', alignItems: 'center' }} />
    )
}

const PostCard = ({ item, onDelete, onPress }: PostCardProps) => {

    const [likes, setLikes] = useState<string[]>([])
    const [userData, setUserData] = useState<UserModel>()
    const { user } = useAuthContext()
    // const [posts, setPosts] = useState()

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
                    onPress: () => onDelete(item.id),
                }
            ],
            { cancelable: false }
        )
    }

    const handleLike = (id: string) => {
        const copyLike = [...likes]
        const index = copyLike.find(item => item == id)

        if (index) {
            const newLike = copyLike.filter(item => item != id)
            setLikes(newLike)
        } else {
            setLikes([...copyLike, id])
        }
    }

    useEffect(() => {
        getUser(item.userID, setUserData)
    }, [])

    return (
        <View style={styles.cardContainer}>
            {/* header */}
            <View style={styles.titleContainer}>
                {userData ? (
                    <Image source={{ uri: userData?.userImg }} style={styles.avatar} />
                ) : (
                    <Image source={images.defaultImage} style={styles.avatar} />
                )}

                <View style={styles.textWrap}>
                    <TouchableOpacity onPress={onPress}>
                        <Text style={[styles.text, { fontWeight: 'bold' }]}>{userData?.fname} {userData?.lname}</Text>
                    </TouchableOpacity>
                    <Text style={[styles.text, { ...FONTS.body4, color: COLORS.gray }]}>{moment(item.postTime.toDate()).fromNow()}</Text>
                </View>
            </View>

            {/* title */}
            <Text style={[styles.text, { marginVertical: SIZES.padding }]}>{item.post}</Text>

            {/* image post */}
            {/* {item.image && <Image source={{ uri: item.image }} style={styles.image} />} */}
            {item.postImg ? (
                <ProgressiveImage
                    defaultImageSource={images.defaultImage}
                    source={{ uri: item.postImg }}
                    style={{ width: '100%', height: 200, borderRadius: SIZES.base }}
                    resizeMode='cover'
                />
            ) : <Divider />}

            {/* button */}
            <View style={styles.buttonContainer}>
                {/* likes button */}
                <TouchableOpacity style={styles.button} onPress={() => handleLike(item.id)}>
                    <FontAwesome name={likes.includes(item.id) ? 'heart' : 'heart-o'} color={likes.includes(item.id) ? COLORS.blue : COLORS.black} size={20} />
                    <Text style={[styles.buttonText, { color: likes.includes(item.id) ? COLORS.blue : COLORS.black }]}>
                        {item.likes} Like{item.likes > 1 ? 's' : ''}
                    </Text>
                </TouchableOpacity>
                {/* comments button */}
                <TouchableOpacity style={{ flexDirection: 'row', alignSelf: 'center' }}>
                    <FontAwesome name='comments-o' color={COLORS.black} size={20} />
                    <Text style={styles.buttonText}>{item.comments} Comment{item.comments > 1 ? 's' : ''}</Text>
                </TouchableOpacity>
                {/* delete button */}
                {user && user.uid == item.userID
                    ? (
                        <TouchableOpacity style={{ flexDirection: 'row', alignSelf: 'center' }} onPress={handleDelete}>
                            <FontAwesome name='trash-o' color={COLORS.black} size={20} />
                        </TouchableOpacity>
                    )
                    : <></>}
            </View>
        </View>
    )
}

export default PostCard

const styles = StyleSheet.create({

    cardContainer: {
        backgroundColor: COLORS.lightGray,
        marginHorizontal: SIZES.padding,
        padding: SIZES.padding,
        borderRadius: SIZES.base,
        marginBottom: SIZES.padding
    },

    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    textWrap: {
        paddingLeft: SIZES.base
    },

    avatar: {
        width: 40,
        height: 40,
        borderRadius: 60,
    },

    image: {
        width: '100%',
        height: 200,
        borderRadius: SIZES.base
    },

    text: {
        color: COLORS.black,
        ...FONTS.body3
    },

    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: SIZES.padding
    },

    button: {
        flexDirection: 'row',
        alignSelf: 'center'
    },

    buttonText: {
        ...FONTS.body4,
        paddingLeft: SIZES.base,
        color: COLORS.black
    }
})