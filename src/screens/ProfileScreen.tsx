import { useState, useEffect } from 'react'
import { Image, Text, View, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, ListRenderItemInfo, FlatList } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import useAuthContext from '../hooks/useAuthContext'
import LinearGradient from 'react-native-linear-gradient'
import firestore from '@react-native-firebase/firestore'

import { COLORS, SIZES, images, FONTS, TypeNotification } from '../constants'
import { PostModel, UserModel } from '../models'
import PostCard from '../components/Post/PostCard'
import { useAppDispatch, useAppSelector, useChat } from '../hooks'
import { utilStyles } from '../styles'
import { Divider } from '../components'
import { UtilIcons } from '../utils/icons'
import { selectPostByUserId, selectPostTagged, selectPostUserLiked, selectUserByUID } from '../redux/selectors'
import { updateUser } from '../redux/actions/user'
import { addNotification } from '../redux/actions/notification'

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

const ProfileScreen = ({ navigation, route }: NativeStackScreenProps<any>) => {

    const { logout } = useAuthContext()
    const [isDelete, setIsDelete] = useState<boolean>(false)
    const params = route.params
    const { addChatData } = useChat()
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

    useEffect(() => {
        setUserData(params ? userParam : currentUser)
    }, [currentUser, userParam])

    const navigateChatScreen = (chatID: string) => {
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
                // backgroundColor: item.id == tag ? COLORS.socialBlue : 'transparent',
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

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* banner */}
                <View>
                    {userData.bannerImg ? <Image source={{ uri: userData.bannerImg }} resizeMode='cover' style={{ height: 160, width: '100%' }} /> :
                        <Image source={images.defaultImage} resizeMode='cover' style={{ height: 160, width: '100%' }} />
                    }
                    <LinearGradient colors={[COLORS.gradient[0], COLORS.gradient[1]]} style={styles.avatarStyle}>
                        {userData.userImg ? <Image source={{ uri: userData.userImg }} style={styles.image} resizeMode='cover' /> : (
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
                    <TouchableOpacity
                        onPress={() => addChatData(params?.userID, navigateChatScreen)}
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
                    </TouchableOpacity>
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

                {
                    tag === 1 && posts.map((item: PostModel, index: number) => {
                        return (
                            <View key={item.id}>
                                <PostCard
                                    item={item}
                                    // onDeletePost={(post) => deletePost(post.id, setIsDelete)}
                                    key={item.id}
                                />
                                {index == posts.length - 1 ? <></> : <Divider />}
                            </View>
                        )
                    })
                }
                {
                    tag === 3 && postUserLiked.map((item: PostModel, index: number) => {
                        return (
                            <View key={item.id}>
                                <PostCard
                                    item={item}
                                    // onDeletePost={(post) => deletePost(post.id, setIsDelete)}
                                    key={item.id}
                                />
                                {index == postUserLiked.length - 1 ? <></> : <Divider />}
                            </View>

                        )
                    })
                }

                {
                    tag === 4 && postTags.map((item: PostModel, index: number) => {
                        return (
                            <View key={item.id}>
                                <PostCard
                                    item={item}
                                    // onDeletePost={(post) => deletePost(post.id, setIsDelete)}
                                    key={item.id}
                                />
                                {index == postTags.length - 1 ? <></> : <Divider />}
                            </View>

                        )
                    })
                }
            </ScrollView>
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
        width: 120,
        height: 120,
        borderRadius: SIZES.width / 0.25,
        alignSelf: 'center',
        marginTop: -50,
    },

    image: {
        width: 115,
        height: 115,
        borderRadius: SIZES.width / 0.25,
        alignSelf: 'center',
        justifyContent: 'center',
        borderColor: COLORS.darkBlack,
        borderWidth: 3,
        marginTop: 2.5,
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