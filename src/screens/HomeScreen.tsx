import { useCallback, useState } from 'react'
import { FlatList, ListRenderItemInfo, RefreshControl, SafeAreaView, ScrollView, View, TouchableOpacity, Animated, ActivityIndicator } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import PushNotification from 'react-native-push-notification'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'

import PostCard from '../components/Post/PostCard'
import { PostModel } from '../models'
import { COLORS, SIZES, images } from '../constants'
import { useAppDispatch, useAppSelector } from '../hooks'
import { showNotification } from '../utils'
import { UtilIcons } from '../utils/icons'
import { Divider, TextComponent } from '../components'
import StoryCard from '../components/StoryCard'
import { reload } from '../redux/actions'
import { fetchNextPosts } from '../redux/actions/post'
import Badges from '../components/Badges'
import { calculateUnreadCount } from '../redux/selectors'

export const LoadScreen = () => {
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <SkeletonPlaceholder >
                <View>
                    <View style={{ marginBottom: SIZES.padding, marginHorizontal: SIZES.padding }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SIZES.base }}>
                            <View style={{ width: 40, height: 40, borderRadius: 60 }} />
                            <View style={{ marginLeft: SIZES.base }}>
                                <View style={{ marginBottom: SIZES.base, width: 80, height: 20, borderRadius: SIZES.base }} />
                                <View style={{ width: 120, height: 20, borderRadius: SIZES.base }} />
                            </View>
                        </View>
                        <View style={{ marginBottom: SIZES.base }}>
                            <View style={{ marginBottom: SIZES.base, width: SIZES.width - 20, height: 20, borderRadius: SIZES.base }} />
                            <View style={{ width: SIZES.width - 20, height: 20, borderRadius: SIZES.base }} />
                        </View>

                        <View style={{ width: SIZES.width - 20, height: 200, borderRadius: SIZES.base }} />
                    </View>
                    <View style={{ marginBottom: SIZES.padding, marginHorizontal: SIZES.padding }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SIZES.base }}>
                            <View style={{ width: 40, height: 40, borderRadius: 60 }} />
                            <View style={{ marginLeft: SIZES.base }}>
                                <View style={{ marginBottom: SIZES.base, width: 80, height: 20, borderRadius: SIZES.base }} />
                                <View style={{ width: 120, height: 20, borderRadius: SIZES.base }} />
                            </View>
                        </View>
                        <View style={{ marginBottom: SIZES.base }}>
                            <View style={{ marginBottom: SIZES.base, width: SIZES.width - 20, height: 20, borderRadius: SIZES.base }} />
                            <View style={{ width: SIZES.width - 20, height: 20, borderRadius: SIZES.base }} />
                        </View>

                        <View style={{ width: SIZES.width - 20, height: 200, borderRadius: SIZES.base }} />
                    </View>
                </View>
            </SkeletonPlaceholder>
        </ScrollView>

    )
}

export const storyData = [
    {
        id: 1,
        storyImage: images.OnBoarding01,
        avatarImage: images.angry
    },
    {
        id: 2,
        storyImage: images.OnBoarding01,
        avatarImage: images.angry
    },
    {
        id: 3,
        storyImage: images.OnBoarding01,
        avatarImage: images.angry
    },
    {
        id: 4,
        storyImage: images.OnBoarding01,
        avatarImage: images.angry
    },
]

const HomeScreen = ({ navigation }: NativeStackScreenProps<any>) => {
    const [isloadNext, setIsLoadNext] = useState<boolean>(false)
    const dispatch = useAppDispatch()
    const posts = useAppSelector(state => state.userState.posts)
    const scrollY = new Animated.Value(0)
    const currentUser = useAppSelector(state => state.userState.currentUser)
    const unreadCount = useAppSelector(state => currentUser ? calculateUnreadCount(state, currentUser.uid) : 0)

    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }: any) => {
        const paddingToBottom = 100
        return layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom
    }

    const testLocalNotification = () => {
        PushNotification.localNotification({
            channelId: "channel-id",
            subText: "My Notification Subtitle",
            title: "My Notification Title",
            message: "My Notification Message",
            picture: "https://www.example.tld/picture.jpg",
            playSound: true,
            soundName: "default",
            number: 1
        });
    }

    const testScheduleNotification = () => {
        PushNotification.localNotificationSchedule({
            channelId: "channel-id",
            message: "My Notification Message", // (required)
            date: new Date(Date.now() + 10 * 1000), // in 60 secs
            allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
            number: 1,
            /* Android Only Properties */
            repeatTime: 1, // (optional) Increment of configured repeatType. Check 'Repeating Notifications' section for more info.
        });
    }

    const onEndReachedHandle = async () => {
        setIsLoadNext(true)

        await dispatch(fetchNextPosts()).then(() => {
            setIsLoadNext(false)
        })

    }

    const onPressHandle = useCallback((userID: string) => {
        navigation.navigate('Profile', { userID: userID })
    }, [])

    const onPressImage = useCallback((imageUrl: string) => {
        if (imageUrl) {
            navigation.navigate('ImageViewScreen', { imageUrl: imageUrl })
        }
    }, [])

    const onDeletePost = useCallback((item: PostModel) => {
        // deletePost(item)
        showNotification('Post deleted successfully', UtilIcons.success)
    }, [])

    const renderItem = ({ item }: ListRenderItemInfo<PostModel>) => {
        return (
            <PostCard
                item={item}
                onDeletePost={onDeletePost}
                onPressUserName={onPressHandle}
            />
        )
    }

    return (
        <SafeAreaView style={{ backgroundColor: COLORS.darkBlack, flex: 1 }}>

            {/* Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SIZES.padding }}>
                <TextComponent
                    title={true}
                    text={`Good Morning${currentUser && currentUser.lname ? ', ' + currentUser.lname : ''} `}
                    style={{ fontWeight: 'bold' }}
                />

                <TouchableOpacity
                    onPress={() => navigation.navigate('Messages')}
                    style={{
                        width: 30,
                        height: 30,
                        borderColor: COLORS.lightGrey,
                        borderWidth: 1,
                        borderRadius: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: unreadCount > 0 ? SIZES.base : 0,
                    }}>

                    <UtilIcons.svgMessage />

                    <Badges unreadCount={unreadCount} containerStyle={{ top: -10, right: -15 }} />
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl onRefresh={() => dispatch(reload())} refreshing={false} />}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    {
                        useNativeDriver: false,
                        listener: (event: any) => {
                            if (isCloseToBottom(event.nativeEvent)) {
                                onEndReachedHandle()
                            }
                        }
                    }
                )}
            >
                {/* Story */}
                <View style={{ borderBottomColor: COLORS.darkGrey, borderBottomWidth: 1, paddingBottom: SIZES.padding }}>
                    <FlatList
                        data={storyData}
                        horizontal
                        contentContainerStyle={{ margin: SIZES.padding, columnGap: SIZES.padding }}
                        ListFooterComponent={() => <View style={{ height: 100 }} />}
                        renderItem={(item) => <StoryCard
                            storySource={item.item.storyImage}
                            avatarSource={item.item.storyImage}
                            onPress={() => navigation.navigate('StoryScreen')}
                        />}
                        keyExtractor={(item, index) => `${item.id}_${index}`}
                    />
                </View>

                <FlatList
                    data={posts}
                    scrollEnabled={false}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => `${item.id}_${index}`}
                    ListFooterComponent={() => isloadNext ? <ActivityIndicator style={{ marginBottom: 70 }} color={COLORS.lightGrey} /> : <View style={{ height: 70 }} />}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <Divider />}
                    style={{ paddingTop: SIZES.base }}
                />
            </ScrollView>
        </SafeAreaView>
    )
}

export default HomeScreen

