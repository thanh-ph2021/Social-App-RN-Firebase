import { useState, useRef, useEffect } from 'react'
import { View, TextInput, StyleSheet, Image, Text, ListRenderItemInfo, FlatList, SafeAreaView } from "react-native"
import { useRoute } from "@react-navigation/native"
import moment from "moment"

import { CommentCard, Icon, PostCard, TypeIcons } from "../components"
import { SIZES, COLORS, images, FONTS } from "../constants"
import { TouchableOpacity } from "react-native-gesture-handler"
import { useAuthContext, usePost } from "../hooks"
import { getTimeNow, showNotification } from '../utils'
import { UtilIcons } from '../utils/icons'
import { CommentModel } from '../models/PostModel'

const IconArray = [
    { type: TypeIcons.Entypo, name: 'images', onPress: () => console.log('click') },
    { type: TypeIcons.MaterialIcons, name: 'gif-box', onPress: () => console.log('click') },
    { type: TypeIcons.MaterialIcons, name: 'tag-faces', onPress: () => console.log('click') },
]

const PostDetailScreen = () => {

    const { params } = useRoute<any>()
    const [focusInput, setFocusInput] = useState(false)
    const [comment, setComment] = useState('')
    const inputRef = useRef<any>()

    const { data } = params
    console.log("🚀 ~ file: PostDetailScreen.tsx:28 ~ PostDetailScreen ~ data:", data.comments[0].likes)
    const { comments } = data
    const { updatePost } = usePost()
    const { user } = useAuthContext()

    const handleBlur = () => {
        inputRef.current.blur()
        setFocusInput(false)
    }

    // useEffect(() => {
    //     const subscriber = firestore()
    //       .collection('Users')
    //       .doc(userId)
    //       .onSnapshot(documentSnapshot => {
    //         console.log('User data: ', documentSnapshot.data());
    //       });

    //     // Stop listening for updates when no longer required
    //     return () => subscriber();
    //   }, [userId]);

    const handleComment = async () => {

        try {
            if (comment) {
                const oldComments = comments ? [...comments] : []
                await updatePost({
                    ...data,
                    comments: [
                        ...oldComments,
                        {
                            userID: user?.uid ?? '',
                            text: comment,
                            createAt: getTimeNow()
                        }]
                })

                showNotification('Your comment sent successful', UtilIcons.success)
                setComment('')
            }
            handleBlur()
        } catch (error) {
            console.log("🚀 ~ file: PostDetailScreen.tsx:27 ~ handleComment ~ error:", error)
        }
    }

    const renderItemComment = ({ item }: ListRenderItemInfo<CommentModel>) => {
        return (
            <CommentCard data={item} />
        )
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <View style={{ flex: 1, paddingTop: SIZES.base, backgroundColor: COLORS.white }}>
                <PostCard item={data} />
                <TouchableOpacity style={{padding: SIZES.base, flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{...FONTS.body3, color: COLORS.black, paddingRight: SIZES.base }}>All comments</Text>
                    <Icon type={TypeIcons.AntDesign} name='down' color={COLORS.black} size={18}/>
                </TouchableOpacity>
                <FlatList
                    data={comments}
                    keyExtractor={(item, index) => index + item.userID}
                    renderItem={renderItemComment}
                />
                <View style={styles.inputContainer}>
                    <View style={styles.inputWrap}>
                        <TextInput
                            ref={inputRef}
                            style={styles.inputText}
                            placeholder="Write a comment..."
                            onFocus={() => setFocusInput(true)}
                            onChangeText={setComment}
                            value={comment}
                        />
                        <View style={styles.iconWrap}>
                            {focusInput ? (
                                <TouchableOpacity onPress={handleComment}>

                                    <Icon type={TypeIcons.Ionicons} name='send' color={COLORS.blue} size={SIZES.icon} />
                                </TouchableOpacity>
                            ) : (
                                IconArray.map((item, index) => {
                                    return (
                                        <TouchableOpacity onPress={item.onPress} key={index}>
                                            <Icon type={item.type} name={item.name} color={COLORS.gray} size={SIZES.icon} />
                                        </TouchableOpacity>
                                    )
                                })
                            )}
                        </View>
                    </View>
                    {focusInput ? (
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 0.3, borderTopColor: COLORS.blue, padding: SIZES.base }}>
                            {IconArray.map((item, index) => {
                                return (
                                    <TouchableOpacity onPress={item.onPress} key={index}>
                                        <Icon type={item.type} name={item.name} color={COLORS.blue} size={SIZES.icon} />
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    ) : <></>}
                </View>
            </View>
        </SafeAreaView>

    )
}

export default PostDetailScreen

const styles = StyleSheet.create({
    inputContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.white,
    },
    inputWrap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 40,
        borderColor: COLORS.gray,
        borderWidth: 1,
        margin: SIZES.base,
        paddingHorizontal: SIZES.base
    },
    inputText: {
        height: 45,
        flex: 2
    },
    iconWrap: {
        flex: 1,
        flexDirection: 'row',
        gap: SIZES.base,
        justifyContent: 'flex-end'
    }
}) 