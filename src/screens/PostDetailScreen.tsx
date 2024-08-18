import { useState, useRef, useEffect, useCallback, useMemo, JSX } from 'react'
import { View, StyleSheet, ListRenderItemInfo, FlatList, SafeAreaView, ScrollView, ActivityIndicator } from "react-native"
import { useRoute } from "@react-navigation/native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { CommentCard, EmptyComponent, Header, Icon, InputBar, PostCard, TextComponent, TypeIcons } from "../components"
import { SIZES, COLORS, FONTS } from "../constants"
import { useAppDispatch, useAppSelector, useAuthContext } from "../hooks"
import { getTimeNow, showNotification } from '../utils'
import { UtilIcons } from '../utils/icons'
import { CommentModel } from '../models'
import { selectPostById } from '../redux/selectors'
import { addComment, loadComments, updateComment } from '../redux/actions/post'
import BottomSheet, { BottomSheetBackdrop, BottomSheetView, BottomSheetFlatList } from '@gorhom/bottom-sheet'
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types'

const IconArray = [
    { type: TypeIcons.Entypo, name: 'images', onPress: () => console.log('click') },
    { type: TypeIcons.MaterialIcons, name: 'gif-box', onPress: () => console.log('click') },
    { type: TypeIcons.MaterialIcons, name: 'tag-faces', onPress: () => console.log('click') },
]

const PostDetailScreen = ({ navigation }: NativeStackScreenProps<any>) => {

    const { params } = useRoute<any>()
    const [comment, setComment] = useState('')
    const [processing, setProcessing] = useState(false)
    const { user } = useAuthContext()
    const dispatch = useAppDispatch()
    const post = useAppSelector(state => selectPostById(state, params.data.id)) ?? params.data
    const inputRef = useRef<any>()
    const bottomSheetRef = useRef<BottomSheet>(null)
    const snapPoints = useMemo(() => ['80%'], [])
    const [bottomData, setBottomData] = useState<string>()

    useEffect(() => {
        dispatch(loadComments(post.id))
    }, [])

    const handleComment = async () => {
        try {
            if (comment) {
                setProcessing(true)

                if (bottomData) {
                    const commnetData: CommentModel = post.comments.filter((item: CommentModel) => item.id == bottomData)[0]
                    await dispatch(updateComment(
                        {
                            ...commnetData,
                            reply: [...commnetData.reply, {
                                userID: user!.uid!,
                                text: comment.trim(),
                                createAt: getTimeNow(),
                                likes: [],
                                reply: [],
                                id: Date.now().toString()+user!.uid!
                            }]
                        },
                        post.id
                    ))

                } else {
                    await dispatch(addComment(
                        {
                            userID: user!.uid!,
                            text: comment.trim(),
                            createAt: getTimeNow(),
                            likes: [],
                            reply: []
                        },
                        post.id
                    ))
                }


                setProcessing(false)

                showNotification('Your comment sent successful', UtilIcons.success)
                setComment('')
                inputRef.current.blur()
            }
        } catch (error) {
            console.log("🚀 ~ file: PostDetailScreen.tsx:27 ~ handleComment ~ error:", error)
        }
    }

    const renderItemComment = ({ item }: ListRenderItemInfo<CommentModel>) => {
        const handleReply = (userReply: string) => {
            handleOpenBottomSheet(item)
            forcusReply(userReply)
        }

        const seeReply = () => {
            handleOpenBottomSheet(item)
        }

        return (
            <CommentCard commentData={item} postId={post.id} handleReply={handleReply} seeReply={seeReply} />
        )
    }

    const onPressMainButton = () => {
        handleComment()
    }

    const forcusReply = (userReply: string) => {
        inputRef.current.focus()
        setComment(`@${userReply} `)
    }

    const renderNoComment = () => {
        return (
            <EmptyComponent title={'No comments yet'} subTitle={'Say something to start the conversation'}/>
        )
    }

    const handleOpenBottomSheet = (data: CommentModel) => {
        setBottomData(data.id!)

        bottomSheetRef.current && bottomSheetRef.current.snapToIndex(0)
    }

    const renderBackdrop = useCallback((props: JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps) => (
        <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
        />
    ), [])

    const renderBottomSheet = () => {

        const onChange = (index: number) => {
            if (index == -1) {
                inputRef.current.blur()
                setComment('')
                setBottomData(undefined)
            }
        }

        const commentData: CommentModel = bottomData ? post.comments.filter((item: CommentModel) => item.id == bottomData)[0] : null

        return (
            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={snapPoints}
                enablePanDownToClose
                backdropComponent={renderBackdrop}
                backgroundStyle={{
                    shadowColor: COLORS.darkBlack,
                    shadowOffset: {
                        width: 0,
                        height: 3,
                    },
                    shadowOpacity: 0.29,
                    shadowRadius: 4.65,
                    elevation: 7,
                    backgroundColor: COLORS.darkGrey
                }}
                onChange={onChange}

            >

                {bottomData && <BottomSheetView>
                    <TextComponent text={'Replies'} style={{ ...FONTS.h2, paddingLeft: SIZES.padding, paddingBottom: SIZES.padding }} />
                    <View style={{
                        paddingVertical: SIZES.padding,
                        backgroundColor: COLORS.darkGrey2,
                        paddingLeft: SIZES.padding,
                        borderTopWidth: 1,
                        borderTopColor: COLORS.lightGrey
                    }}>
                        <CommentCard commentData={commentData} postId={post.id} handleReply={forcusReply} />
                    </View>
                </BottomSheetView>}
                {bottomData && <BottomSheetFlatList
                    data={commentData.reply}
                    renderItem={({ item }) => {
                        return (
                            <CommentCard commentData={item} postId={post.id} handleReply={forcusReply} parentData={commentData}/>
                        )
                    }}
                    keyExtractor={(item, index) => item.createAt.toString() + index}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={() => <View style={{ height: 60 }} />}
                    contentContainerStyle={{ paddingLeft: SIZES.padding * 4, paddingVertical: SIZES.padding, gap: SIZES.padding }}
                />}
            </BottomSheet>
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
                <PostCard item={post} />

                <View style={{ height: 2, backgroundColor: COLORS.darkGrey }} />

                {/* comment data */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: SIZES.padding }}>
                    <TextComponent text={`${'Comment'.toUpperCase()}`} style={{ paddingRight: SIZES.base }} color={COLORS.socialWhite} />
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                        <TextComponent text={'Recent'} style={{ paddingRight: SIZES.base, fontWeight: 'bold' }} color={COLORS.socialWhite} />
                        <UtilIcons.svgChevronDown color={COLORS.socialWhite} />
                    </TouchableOpacity>
                </View>

                <FlatList
                    scrollEnabled={false}
                    data={post.comments}
                    keyExtractor={(item, index) => index + item.userID}
                    renderItem={renderItemComment}
                    style={{ padding: SIZES.padding }}
                    contentContainerStyle={{ gap: SIZES.padding }}
                    ListFooterComponentStyle={{ height: 60 }}
                    ListEmptyComponent={renderNoComment}
                />
                <View style={{ height: SIZES.padding * 7 }} />
            </ScrollView>
            {renderBottomSheet()}
            {/* send comment */}
            <View style={styles.inputContainer}>
                <InputBar
                    ref={inputRef}
                    placeholder="Type your comment here..."
                    value={comment}
                    onChangeText={setComment}
                    mainButton={processing ? <ActivityIndicator color={COLORS.socialBlue} /> : undefined}
                    onPressMainButton={onPressMainButton}
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