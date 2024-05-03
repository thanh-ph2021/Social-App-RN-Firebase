import { useState, useRef, useEffect } from 'react'
import { View, TextInput, StyleSheet, Image, Text, ListRenderItemInfo, FlatList, SafeAreaView, ScrollView } from "react-native"
import { useRoute } from "@react-navigation/native"
import moment from "moment"
import { TouchableOpacity } from "react-native-gesture-handler"
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { CommentCard, Header, Icon, InputBar, PostCard, TextComponent, TypeIcons } from "../components"
import { SIZES, COLORS, images, FONTS } from "../constants"
import { useAuthContext, usePost } from "../hooks"
import { getTimeNow, showNotification } from '../utils'
import { UtilIcons } from '../utils/icons'
import { CommentModel } from '../models/PostModel'

const IconArray = [
    { type: TypeIcons.Entypo, name: 'images', onPress: () => console.log('click') },
    { type: TypeIcons.MaterialIcons, name: 'gif-box', onPress: () => console.log('click') },
    { type: TypeIcons.MaterialIcons, name: 'tag-faces', onPress: () => console.log('click') },
]

const PostDetailScreen = ({ navigation }: NativeStackScreenProps<any>) => {

    const { params } = useRoute<any>()

    const [comment, setComment] = useState('')


    const { data } = params
    const { comments } = data
    const { updatePost } = usePost()
    const { user } = useAuthContext()



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
            // handleBlur()
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
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.darkBlack }}>
            <Header
                title={'Post'}
                leftComponent={
                    <TouchableOpacity style={styles.btnHeaderLeft} onPress={() => navigation.goBack()}>
                        <UtilIcons.svgArrowLeft color={COLORS.socialWhite} />
                    </TouchableOpacity>
                }
            />
            <ScrollView>
                {/* content post */}
                <PostCard item={data} />

                <View style={{ height: 2, backgroundColor: COLORS.darkGrey }} />

                {/* comment data */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: SIZES.padding }}>
                    <TextComponent text={`${'Comment'.toUpperCase()} (${50})`} style={{ paddingRight: SIZES.base }} color={COLORS.socialWhite} />
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                        <TextComponent text={'Recent'} style={{ paddingRight: SIZES.base, fontWeight: 'bold' }} color={COLORS.socialWhite} />
                        <UtilIcons.svgChevronDown color={COLORS.socialWhite} />
                    </TouchableOpacity>
                </View>

                <FlatList
                    scrollEnabled={false}
                    data={comments}
                    keyExtractor={(item, index) => index + item.userID}
                    renderItem={renderItemComment}
                    style={{ padding: SIZES.padding }}
                    contentContainerStyle={{ gap: SIZES.padding }}
                    ListFooterComponentStyle={{ height: 60 }}
                />
                <View style={{ height: SIZES.padding * 7 }} />
            </ScrollView>
            {/* send comment */}
            <View style={styles.inputContainer}>
                <InputBar
                    placeholder="Type your comment here..."
                    options={() => {
                        return (
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                                borderTopWidth: 0.3,
                                borderTopColor: COLORS.lightGrey,
                                padding: SIZES.base,
                            }}>
                                {IconArray.map((item, index) => {
                                    return (
                                        <TouchableOpacity onPress={item.onPress} key={index}>
                                            <Icon type={item.type} name={item.name} color={COLORS.socialWhite} size={SIZES.icon} />
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                        )
                    }}
                />
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
        backgroundColor: COLORS.black,
    },
    inputWrap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 40,
        margin: SIZES.padding,
        marginBottom: SIZES.padding * 2,
        paddingHorizontal: SIZES.base,
        backgroundColor: COLORS.darkGrey
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
    },
    btnHeaderLeft: {
        width: 32,
        height: 32,
        borderRadius: 20,
        borderColor: COLORS.lightGrey,
        borderWidth: 1,
        marginHorizontal: SIZES.padding,
        alignItems: 'center',
        justifyContent: 'center'
    }
}) 