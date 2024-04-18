import { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import moment from "moment"

import { SIZES, COLORS, images, FONTS } from "../constants"
import { CommentModel } from '../models/PostModel'
import { Avatar, Icon, PostCard, TypeIcons } from "../components"
import { useAuthContext, useUser } from "../hooks"
import { UserModel } from '../models'
import LikeButton from './Post/LikeButton'

export type CommentCardProps = {
    data: CommentModel
}

const CommentCard = ({ data }: CommentCardProps) => {
    console.log("🚀 ~ file: CommentCard.tsx:17 ~ CommentCard ~ data:", data)

    const [userData, setUserData] = useState<UserModel>()
    const { getUserFromHook } = useUser()
    const { user } = useAuthContext()

    useEffect(() => {
        const getUser = async () => {
            const user = await getUserFromHook(data.userID)
            if (user) {
                setUserData(user)
            }
        }

        getUser()
    }, [])

    const handleLike = () => {
        const oldLikes = data.likes ? [...data.likes] : []
        data.likes = [
            ...oldLikes,
            {
                type: 'haha',
                userID: user?.uid ?? ''
            }]
        console.log("🚀 ~ file: CommentCard.tsx:37 ~ handleLike ~ data:", data)
    }

    return (
        <View style={{ flexDirection: 'row', padding: SIZES.base }}>
            {userData ? <Avatar source={{ uri: userData.userImg }} /> : <></>}
            <View style={{ marginLeft: SIZES.base, marginRight: SIZES.padding, flex: 1 }}>
                <View style={{ backgroundColor: COLORS.lightGray2, padding: SIZES.base, borderRadius: SIZES.padding }}>
                    <Text style={{ ...FONTS.body4, color: COLORS.black, fontWeight: 'bold' }}>{userData?.fname} {userData?.lname}</Text>
                    <Text style={styles.text}>{data.text}</Text>
                </View>

                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ ...FONTS.body3 }}>{moment(data.createAt.toDate()).fromNow()}</Text>
                    <TouchableOpacity onPress={handleLike}>
                        <Text style={{ ...FONTS.body3, fontWeight: 'bold', paddingHorizontal: SIZES.base }}>Like</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text style={{ ...FONTS.body3, fontWeight: 'bold', paddingHorizontal: SIZES.base }}>Reply</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default CommentCard

const styles = StyleSheet.create({
    text: {
        ...FONTS.body3,
        color: COLORS.black
    }
})