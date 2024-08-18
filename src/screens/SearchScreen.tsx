import { FlatList, ListRenderItemInfo, StyleSheet, Text, TextInput, View } from "react-native"
import { useCallback, useRef, useState } from "react"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { TouchableOpacity } from "@gorhom/bottom-sheet"

import { UtilIcons } from "../utils/icons"
import { COLORS, FONTS, SIZES } from "../constants"
import { utilStyles } from "../styles"
import { PostModel, UserModel } from "../models"
import { Divider, PostCard, TextComponent, UserComponent } from "../components"
import LottieView from "lottie-react-native"
import { searchPosts } from "../redux/actions/post"
import { searchUsers } from "../redux/actions/user"
import ImageItem from "../components/Post/ImageItem"
import VideoItem from "../components/Post/VideoItem"

const tagDatas = [
    {
        id: 1,
        name: 'All'
    },
    {
        id: 2,
        name: 'Profiles'
    },
    {
        id: 3,
        name: 'Photos'
    },
    {
        id: 4,
        name: 'Videos'
    },
]

const SearchScreen = ({ navigation }: NativeStackScreenProps<any>) => {

    const [isLoad, setIsLoad] = useState<boolean>(false)
    const [tag, setTag] = useState<number>(1)
    const [searchText, setSearchText] = useState<string>('')
    const [posts, setPosts] = useState<PostModel[]>([])
    const [postImages, setPostImages] = useState<PostModel[]>([])
    const [postVideos, setPostVideos] = useState<PostModel[]>([])
    const [users, setUsers] = useState<UserModel[]>([])
    const [activeIndex, setActiveIndex] = useState(0)

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems[0]) {
            setActiveIndex(viewableItems[0].index)
        }
    })


    const onPressHandle = useCallback((userID: string) => {
        navigation.navigate('Profile', { userID: userID })
    }, [])

    const gotoDetail = useCallback((item: PostModel) => {
        navigation.navigate('VideoDetail', { data: item })
    }, [])

    const renderPostItem = ({ item }: ListRenderItemInfo<PostModel>) => {
        return (
            <PostCard
                item={item}
                onPressUserName={onPressHandle}
            />
        )
    }

    const renderUserItem = ({ item }: ListRenderItemInfo<string>) => {
        return (
            <UserComponent uid={item} onPress={() => navigation.push('Profile', { userID: item })} />
        )
    }

    const renderPostImage = ({ item }: ListRenderItemInfo<PostModel>) => {
        return (
            <TouchableOpacity onPress={() => navigation.push('PostDetailScreen', { data: item })}>
                <ImageItem
                    uri={item.media![0].uri}
                    text={item.post}
                />
            </TouchableOpacity>

        )
    }

    const renderPostVideo = ({ item, index }: ListRenderItemInfo<PostModel>) => {
        return (
            <VideoItem
                data={item}
                shouldPlay={index === activeIndex}
                onPressAvatar={onPressHandle}
                onPressVideo={() => gotoDetail(item)}
            />
        )
    }

    const renderTag = ({ item }: ListRenderItemInfo<{ id: number, name: string }>) => {

        const onPress = () => {
            setTag(item.id)
        }

        return (
            <TouchableOpacity style={{
                borderWidth: 1,
                padding: SIZES.base,
                borderRadius: 18,
                borderColor: item.id == tag ? 'transparent' : COLORS.lightGrey,
                backgroundColor: item.id == tag ? COLORS.socialBlue : 'transparent'
            }} onPress={onPress}>
                <Text style={utilStyles.text}>{item.name}</Text>
            </TouchableOpacity>
        )

    }

    const onSearch = async () => {
        setIsLoad(true)

        try {
            const posts = await searchPosts(searchText)
            const postImages = await searchPosts(searchText, 'image')
            const postVideos = await searchPosts(searchText, 'video')
            const users = await searchUsers(searchText)
            setPosts(posts ?? [])
            setPostImages(postImages ?? [])
            setPostVideos(postVideos ?? [])
            setUsers(users ?? [])

        } catch (error) {
            console.log("🚀 ~ onSearch ~ error:", error)
        } finally {
            setIsLoad(false)
        }
    }

    return (

        <View style={{ flex: 1, paddingVertical: SIZES.padding, backgroundColor: COLORS.darkBlack }}>
            {/* search bar */}
            <View style={{
                backgroundColor: COLORS.darkGrey,
                borderRadius: 32,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginHorizontal: SIZES.padding
            }}>
                <TextInput
                    autoFocus
                    placeholder="Search for people, posts, tags..."
                    placeholderTextColor={COLORS.socialWhite}
                    style={{ paddingHorizontal: SIZES.padding, flex: 2, color: COLORS.socialWhite }}
                    onChangeText={setSearchText}
                    onSubmitEditing={onSearch}
                />
                <View style={{ paddingHorizontal: SIZES.padding }}>
                    <UtilIcons.svgSearch color={COLORS.lightGrey} />
                </View>
            </View>
            {/* body */}
            <View style={{ paddingVertical: SIZES.padding }}>
                {/* header title */}
                <View style={{ marginLeft: SIZES.padding, marginBottom: SIZES.padding }}>

                    {/* tags */}
                    <FlatList
                        horizontal
                        data={tagDatas}
                        contentContainerStyle={{ columnGap: SIZES.padding, paddingVertical: SIZES.base }}
                        renderItem={renderTag}
                        keyExtractor={(item, index) => item.name + index}
                    />
                </View>

                {isLoad ? (
                    <View style={{ justifyContent: 'center', alignItems: "center" }}>
                        <LottieView
                            source={require("../assets/animations/loader.json")}
                            style={{ width: 300, height: 300 }}
                            autoPlay
                            loop
                        />
                    </View>

                ) : (
                    <>
                        {users.length !== 0 && (tag === 1 || tag === 2) ? (
                            <>
                                <TextComponent text='People' style={styles.text} />
                                <FlatList
                                    data={users.map((user: UserModel) => user.uid!)}
                                    renderItem={renderUserItem}
                                    keyExtractor={(item, index) => `$_${index}`}
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={{ margin: SIZES.padding, gap: SIZES.padding }}
                                    ListFooterComponent={<View style={{ height: 100 }} />}
                                />
                                <Divider />
                            </>
                        ) : <></>}

                        {posts.length !== 0 && (tag === 1) ?
                            (<>
                                <TextComponent text='Post' style={styles.text} />
                                {/* content search */}
                                <FlatList
                                    data={posts}
                                    renderItem={renderPostItem}
                                    keyExtractor={(item, index) => `${item.id}_${index}`}
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={{ marginVertical: SIZES.padding }}
                                    ItemSeparatorComponent={() => <Divider />}
                                    ListFooterComponent={<View style={{ height: 120 }} />}
                                />
                            </>
                            ) : <></>}

                        {postImages.length !== 0 && (tag === 3) ?
                            (<>
                                {/* content search */}
                                <FlatList
                                    data={postImages}
                                    renderItem={renderPostImage}
                                    numColumns={3}
                                    keyExtractor={(item, index) => `${item.id}_${index}`}
                                    showsVerticalScrollIndicator={false}
                                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                                    ListFooterComponent={<View style={{ height: 100 }} />}
                                />
                            </>
                            ) : <></>}

                        {postVideos.length !== 0 && (tag === 4) ?
                            (<>
                                {/* content search */}
                                <FlatList
                                    data={postVideos}
                                    renderItem={renderPostVideo}
                                    keyExtractor={(item, index) => `${item.id}_${index}`}
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={{ gap: SIZES.padding }}
                                    onViewableItemsChanged={onViewableItemsChanged.current}
                                    viewabilityConfig={{
                                        itemVisiblePercentThreshold: 100,
                                    }}
                                    ListFooterComponent={<View style={{ height: 100 }} />}
                                />
                            </>
                            ) : <></>}
                    </>
                )}
            </View>
        </View>

    )
}

export default SearchScreen

const styles = StyleSheet.create({
    text: {
        ...FONTS.h3,
        fontWeight: 'bold',
        paddingHorizontal: SIZES.padding,
    }
})