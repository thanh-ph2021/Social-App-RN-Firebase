import { useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity } from "react-native"
import moment from "moment"

import { SIZES, COLORS, FONTS } from "../constants"
import { CommentModel } from '../models/PostModel'
import { Avatar, TextComponent } from "../components"
import { useAuthContext, useUser } from "../hooks"
import { UserModel } from '../models'
import { UtilIcons } from '../utils/icons'

export type CommentCardProps = {
    data: CommentModel
}

const CommentCard = ({ data }: CommentCardProps) => {

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
    }

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row' }}>
                {
                    userData ? <Avatar source={{ uri: userData.userImg }} size='s' /> : <></>
                }
                <View style={{marginLeft: SIZES.padding}}>
                    <TextComponent text={`${userData?.fname} ${userData?.lname}`} style={{ fontWeight: 'bold' }} color={COLORS.socialWhite} />
                    <TextComponent text={`${data.text}`} color={COLORS.socialWhite} />
                    <View style={{ flexDirection: 'row' }}>
                        <TextComponent text={moment(data.createAt.toDate()).fromNow()} color={COLORS.lightGrey} />
                        <TouchableOpacity style={{ marginLeft: SIZES.padding }}>
                            <TextComponent text={'Reply'} style={{ fontWeight: 'bold' }} color={COLORS.lightGrey} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <TouchableOpacity onPress={handleLike} style={{ alignItems: 'flex-end' }}>
                <UtilIcons.svgLike color={COLORS.lightGrey} />
            </TouchableOpacity>
        </View>
    )
}

export default CommentCard