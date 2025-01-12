import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FlatList, ListRenderItemInfo, RefreshControl, SafeAreaView, View, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import PushNotification from 'react-native-push-notification'

import PostCard from '../components/Post/PostCard'
import { PostModel } from '../models'
import { COLORS, SIZES } from '../constants'
import { useAppDispatch, useAppSelector } from '../hooks'
import { getGreeting } from '../utils'
import { UtilIcons } from '../utils/icons'
import { Divider, EmptyComponent, TextComponent } from '../components'
import StoryCard from '../components/StoryCard'
import { reload } from '../redux/actions'
import { fetchNextPosts, selectPost } from '../redux/actions/post'
import Badges from '../components/Badges'
import { calculateUnreadCount } from '../redux/selectors'
import { GreetingLoader, PostLoader, StoryLoader } from '../components/Loader'
import PostOptionBottomSheet from '../components/Post/PostOptionBottomSheet'

const HomeScreen = ({ navigation }: NativeStackScreenProps<any>) => {
    const dispatch = useAppDispatch()
    const posts = useAppSelector(state => state.userState.posts)
    const loading = useAppSelector(state => state.userState.loading)
    const { stories, loading: storyLoading } = useAppSelector(state => state.storyState)
    const currentUser = useAppSelector(state => state.userState.currentUser)
    const unreadCount = useAppSelector(state => currentUser ? calculateUnreadCount(state, currentUser.uid) : 0)
    const [greating, setGreating] = useState('')
    const sheetRef = useRef<any>()

    useEffect(() => {
        setGreating(getGreeting())
    }, [])

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

    const onEndReached = async () => {
        await dispatch(fetchNextPosts())
    }

    const renderItem = useCallback(({ item, index }: ListRenderItemInfo<PostModel>) => {

        const onPressHandle = (userID: string) => {
            navigation.navigate('Profile', { userID: userID })
        }

        const onPressOptions = () => {
            dispatch(selectPost(item))
            sheetRef.current.snapTo(0)
        }

        return (
            <PostCard
                item={item}
                onPressUserName={onPressHandle}
                onPressOptions={onPressOptions}
            />
        )
    }, [])

    const renderStories = () => {
        return (
            <View style={{ borderBottomColor: COLORS.darkGrey, borderBottomWidth: 1, marginBottom: SIZES.base }}>
                <FlatList
                    data={storyLoading ? [{ id: 'loading' }, ...stories] : stories}
                    horizontal
                    contentContainerStyle={{ margin: SIZES.padding, columnGap: SIZES.padding }}
                    ListFooterComponent={() => <View style={{ height: 100 }} />}
                    renderItem={({ item, index }) => {
                        if (item.id === 'loading') {
                            return (
                                <View style={styles.storyStyle}>
                                    <ActivityIndicator size="small" color={COLORS.socialPink} />
                                    <TextComponent text='Creating story ...' />
                                </View>
                            )
                        }
                        return <StoryCard
                            story={item}
                            onPress={() => navigation.navigate('StoryScreen', { index })}
                        />
                    }}
                    keyExtractor={(item, index) => `${item.id}_${index}`}
                />
            </View>
        )
    }

    const renderContent = () => {
        if (!loading) {
            return (
                <FlatList
                    data={posts}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => `${item.id}_${index}`}
                    ListHeaderComponent={renderStories()}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <Divider />}
                    ListEmptyComponent={() => <EmptyComponent title={'No data yet'} />}
                    refreshControl={
                        <RefreshControl
                            onRefresh={() => {
                                dispatch(reload())
                            }}
                            refreshing={false}
                        />
                    }
                    onEndReachedThreshold={0.1}
                    onEndReached={onEndReached}
                />
            )
        }

        return (
            <>
                <StoryLoader />
                <PostLoader />
                <PostLoader />
            </>
        )
    }

    return (
        <SafeAreaView style={{ backgroundColor: COLORS.darkBlack, flex: 1 }}>
            {/* Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SIZES.padding }}>
                {greating ? <TextComponent
                    title={true}
                    text={`${greating}, ${currentUser && currentUser.lname ? currentUser.lname : ''} `}
                    style={{ fontWeight: 'bold' }}
                /> : <GreetingLoader />}
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

            {/* Content */}
            {renderContent()}

            <PostOptionBottomSheet
                index={-1}
                ref={sheetRef}
            />
        </SafeAreaView >
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    storyStyle: {
        width: 100,
        height: 140,
        flex: 1,
        borderRadius: 16,
        backgroundColor: COLORS.darkGrey,
        flexShrink: 1,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
})

