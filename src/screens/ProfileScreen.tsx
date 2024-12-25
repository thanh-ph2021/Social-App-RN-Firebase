import React, { useState, useEffect, useRef } from 'react'
import { Image, Text, View, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, ListRenderItemInfo, FlatList } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import LinearGradient from 'react-native-linear-gradient'
import firestore from '@react-native-firebase/firestore'

import { COLORS, SIZES, images, FONTS, TypeNotification } from '../constants'
import { PostModel, UserModel } from '../models'
import PostCard from '../components/Post/PostCard'
import { useAppDispatch, useAppSelector } from '../hooks'
import { utilStyles } from '../styles'
import { Divider, MediaGridCollapse } from '../components'
import { UtilIcons } from '../utils/icons'
import { selectPostByUserId, selectPostTagged, selectPostUserLiked, selectStoryByUID, selectUserByUID } from '../redux/selectors'
import { updateUser } from '../redux/actions/user'
import { addNotification } from '../redux/actions/notification'
import { addChat, markChatAsRead } from '../redux/actions/chat'
import StoryCard from '../components/StoryCard'
import PostOptionBottomSheet from '../components/Post/PostOptionBottomSheet'
import { selectPost } from '../redux/actions/post'

const tagDatas = [
    {
        id: 1,
        name: 'Posts'
    },
    {
        id: 2,
        name: 'Stories'
    },
    {
        id: 3,
        name: 'Liked'
    },
    {
        id: 4,
        name: 'Tagged'
    },
]

const SIZE_AVATAR = SIZES.width * 0.35

const ProfileScreen = ({ navigation, route }: NativeStackScreenProps<any>) => {

    const [isDelete, setIsDelete] = useState<boolean>(false)
    const params = route.params
    const [tag, setTag] = useState<number>(1)
    const currentUser = useAppSelector(state => state.userState.currentUser)
    const userParam = params ? useAppSelector(state => selectUserByUID(state, params.userID)) : null
    const [userData, setUserData] = useState<UserModel>(params ? userParam : currentUser)
    const posts = useAppSelector(state => selectPostByUserId(state, params ? params.userID : currentUser!.uid))
    const dispatch = useAppDispatch()
    const [follow, setFollow] = useState(params ? currentUser.followings?.includes(params!.userID) : false)
    const postUserLiked = useAppSelector(state => selectPostUserLiked(state, currentUser.uid))
    const postTags = currentUser.postTags ? useAppSelector(state => selectPostTagged(state, currentUser.postTags)) : []
    const followNoti = useAppSelector(state => state.asyncstorageState.followNoti)
    const userStories = useAppSelector(state => selectStoryByUID(state, currentUser.uid))
    const sheetRef = useRef<any>()
    const [activeIndex, setActiveIndex] = useState(0)
    const [activeData, setActiveData] = useState(posts)

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems[0]) {
            setActiveIndex(viewableItems[0].index)
        }
    })

    useEffect(() => {
        switch (tag) {
            case 1:
                setActiveData(posts)
                break
            case 3:
                setActiveData(postUserLiked)
                break
            case 4:
                setActiveData(postTags)
                break
        }
    }, [tag])

    useEffect(() => {
        setUserData(params ? userParam : currentUser)
    }, [currentUser, userParam])

    const navigateChatScreen = (chatID: string) => {
        dispatch(markChatAsRead(chatID))
        navigation.navigate('Chat', { userData: userData, chatID: chatID })
    }

    const renderTag = ({ item }: ListRenderItemInfo<{ id: number, name: string }>) => {

        const onPress = () => {
            setTag(item.id)
        }

        if (params && (item.name === 'Liked' || item.name === 'Tagged')) {
            return <></>
        }

        return (
            <TouchableOpacity style={{
                paddingVertical: SIZES.base,
            }} onPress={onPress}>

                <Text style={[
                    utilStyles.text,
                    {
                        fontWeight: item.id == tag ? 'bold' : 'normal'
                    }
                ]}>
                    {item.name}
                </Text>
                <View style={{
                    backgroundColor: item.id == tag ? COLORS.socialBlue : 'transparent',
                    height: 4,
                    bottom: -SIZES.base,
                    borderRadius: 5

                }} />
            </TouchableOpacity>
        )
    }

    const onFollow = async () => {
        try {
            setFollow(!follow)
            let followings: string[] = currentUser.followings ?? []
            let followers: string[] = userParam.followers ?? []

            if (followings.includes(params!.userID)) {
                followings = followings.filter(item => item !== params!.userID)
                followers = followers.filter(item => item !== currentUser.uid)
            } else {
                followings = [...followings, params!.userID]
                followers = [...followers, currentUser.uid]

                if (userParam.uid != currentUser.uid && followNoti) {
                    await dispatch(addNotification({
                        createdAt: firestore.Timestamp.fromDate(new Date()),
                        isRead: false,
                        message: `${currentUser.fname} ${currentUser.lname} followed you`,
                        postId: '',
                        receiverId: userParam.uid!,
                        senderId: currentUser.uid,
                        type: TypeNotification.Follow,
                    }))
                }
            }

            await dispatch(updateUser({
                ...currentUser,
                followers: currentUser.followers ?? [],
                followings: followings
            }))

            await dispatch(updateUser({
                ...userParam,
                followings: userParam.followings ?? [],
                followers: followers
            }))

        } catch (error) {
            console.log("🚀 ~ onFollow ~ error:", error)
        }
    }

    const onPressMessage = () => {
        dispatch(addChat(params?.userID, navigateChatScreen))
    }

    const onPressOptions = (post: PostModel) => {
        dispatch(selectPost(post))
        sheetRef.current.snapTo(0)
    }

    const renderPosts = (data: PostModel[]) => {
        return (
            <FlatList
                data={data}
                scrollEnabled={false}
                keyExtractor={(item) => item.id!}
                renderItem={({ item, index }) => {
                    return (
                        <PostCard
                            item={item}
                            key={item.id}
                            onPressOptions={() => onPressOptions(item)}
                            shouldPlayVideo={index === activeIndex}
                        />
                    )
                }}
                ItemSeparatorComponent={() => <Divider />}
            />
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* banner */}
                <View>
                    {userData.bannerImg ? <MediaGridCollapse medias={[{ uri: userData.bannerImg, type: 'image' }]} imageStyle={styles.bannerImg} /> :
                        <Image source={images.defaultImage} resizeMode='cover' style={styles.bannerImg} />
                    }

                    <LinearGradient colors={[COLORS.gradient[0], COLORS.gradient[1]]} style={styles.avatarStyle}>
                        {userData.userImg ? <MediaGridCollapse medias={[{ uri: userData.userImg, type: 'image' }]} imageStyle={styles.image} /> : (
                            <Image source={images.defaultImage} style={styles.image} resizeMode='cover' />
                        )}
                    </LinearGradient>

                </View>

                {/* back button */}
                {params && <TouchableOpacity style={styles.btnHeaderLeft} onPress={() => navigation.goBack()}>
                    <UtilIcons.svgArrowLeft color={COLORS.socialWhite} />
                </TouchableOpacity>}

                {!params && <TouchableOpacity style={[styles.btnHeaderLeft, { right: 0 }]} onPress={() => navigation.navigate('Settings')}>
                    <UtilIcons.svgSettings color={COLORS.socialWhite} />
                </TouchableOpacity>}

                <View style={styles.wrapUserName}>
                    <Text style={styles.textTitle}>
                        {userData.fname} {userData.lname}
                    </Text>
                    {params && <TouchableOpacity
                        onPress={onPressMessage}
                        style={{
                            width: 35,
                            height: 35,
                            borderColor: COLORS.lightGrey,
                            borderWidth: 1,
                            borderRadius: 20,
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'absolute',
                            right: -50,
                            bottom: -5
                        }}>
                        <UtilIcons.svgMessage />
                    </TouchableOpacity>}
                </View>

                {/* address */}
                <Text style={styles.textAddress}>
                    {userData.city} {userData.country}
                </Text>

                {/* bio */}
                <Text style={styles.text}>
                    {userData.about}
                </Text>

                {/* information */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', marginVertical: SIZES.padding }}>

                    <TouchableOpacity style={styles.contentStyle} onPress={() => navigation.push('Friends', { routeName: 'Follower', uid: userData.uid })}>
                        <Text style={styles.text}>{userData.followers ? userData.followers.length : 0}</Text>
                        <Text style={[styles.text, { color: COLORS.lightGrey }]}>Followers</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.contentStyle} onPress={() => navigation.push('Friends', { routeName: 'Following', uid: userData.uid })}>
                        <Text style={styles.text}>{userData.followings ? userData.followings.length : 0}</Text>
                        <Text style={[styles.text, { color: COLORS.lightGrey }]}>Followings</Text>
                    </TouchableOpacity>

                    {params ? (
                        <TouchableOpacity style={[styles.button, { backgroundColor: COLORS.socialPink, borderWidth: 0 }]} onPress={onFollow}>
                            <Text style={styles.buttonText}>{follow ? `Unfollow` : `Follow`}</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('UpdateProfile')}>
                            <Text style={styles.buttonText}>Edit Profile</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* tags */}
                <FlatList
                    horizontal
                    data={tagDatas}
                    style={{
                        borderBottomColor: COLORS.lightGrey,
                        borderBottomWidth: 1,
                        marginHorizontal: SIZES.padding,
                        marginBottom: SIZES.padding
                    }}
                    contentContainerStyle={{
                        justifyContent: 'space-between',
                        flex: 1
                    }}
                    renderItem={renderTag}
                    keyExtractor={(item, index) => item.name + index}
                />

                {tag === 1 && renderPosts(posts)}
                {
                    tag === 2 && (
                        <FlatList
                            data={userStories}
                            horizontal
                            contentContainerStyle={{ margin: SIZES.padding }}
                            ListFooterComponent={() => <View style={{ height: 100 }} />}
                            renderItem={({ item }) => {
                                return <StoryCard
                                    story={item}
                                    onPress={() => navigation.navigate('StoryScreen', { userStories })}
                                />
                            }}
                            keyExtractor={(item, index) => `${item.id}_${index}`}
                        />
                    )
                }
                {tag === 3 && renderPosts(postUserLiked)}
                {tag === 4 && renderPosts(postTags)}
            </ScrollView>
            <PostOptionBottomSheet
                index={0}
                ref={sheetRef}
            />
        </SafeAreaView>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.darkBlack
    },

    avatarStyle: {
        width: SIZE_AVATAR,
        height: SIZE_AVATAR,
        borderRadius: SIZES.width / 0.25,
        alignSelf: 'center',
        marginTop: -50,
    },

    image: {
        width: SIZE_AVATAR - 5,
        height: SIZE_AVATAR - 5,
        borderRadius: SIZES.width / 0.25,
        alignSelf: 'center',
        borderColor: COLORS.darkBlack,
        borderWidth: 3,
        marginTop: 2.5,
    },

    bannerImg: {
        height: SIZES.height * 0.25,
        width: '100%'
    },

    textTitle: {
        ...FONTS.h2,
        textAlign: 'center',
        color: COLORS.socialWhite,
        paddingTop: SIZES.padding
    },

    text: {
        ...FONTS.body3,
        textAlign: 'center',
        color: COLORS.socialWhite,
    },

    textAddress: {
        ...FONTS.body3,
        textAlign: 'center',
        color: COLORS.lightGrey,
    },

    buttonWrap: {
        flexDirection: 'row',
        marginTop: SIZES.base,
        alignSelf: 'center'
    },

    button: {
        borderColor: COLORS.lightGrey,
        borderWidth: 1,
        borderRadius: 30,
        alignSelf: 'center',
        marginHorizontal: SIZES.padding,
        width: '30%'
    },

    buttonText: {
        ...FONTS.body3,
        textAlign: 'center',
        color: COLORS.socialWhite,
        padding: SIZES.padding,
        fontWeight: 'bold'
    },

    contentStyle: {
        paddingHorizontal: SIZES.padding,
        alignItems: 'flex-start'
    },

    wrapUserName: {
        flexDirection: 'row',
        alignSelf: 'center'
    },

    btnHeaderLeft: {
        position: 'absolute',
        backgroundColor: COLORS.darkBlack,
        top: 20,
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