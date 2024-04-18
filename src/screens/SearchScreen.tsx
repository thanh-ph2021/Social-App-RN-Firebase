import { FlatList, ListRenderItemInfo, RefreshControl, StyleSheet, Text, TextInput, View } from "react-native"
import { utilStyles } from "../styles"
import { COLORS, FONTS, SIZES } from "../constants"
import { UtilIcons } from "../utils/icons"
import { usePost } from "../hooks"
import { useCallback, useEffect, useState } from "react"
import { PostModel } from "../models"
import { Divider, PostCard } from "../components"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { showNotification } from "../utils"
import { ScrollView } from "react-native-gesture-handler"
import { TouchableOpacity } from "@gorhom/bottom-sheet"

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
    {
        id: 5,
        name: 'Text'
    },
    {
        id: 6,
        name: 'Links'
    },
]

const SearchScreen = ({ navigation }: NativeStackScreenProps<any>) => {

    const { data, isLoading, getPost, getPostNext, deletePost } = usePost()
    const [isloadNext, setIsLoadNext] = useState<boolean>(false)
    const [tag, setTag] = useState<number>(1)

    useEffect(() => {
        getPost()
    }, [])

    const onDeletePost = useCallback((item: PostModel) => {
        deletePost(item)
        showNotification('Post deleted successfully', UtilIcons.success)
    }, [])

    const onPressHandle = useCallback((userID: string) => {
        navigation.navigate('Profile', { userID: userID })
    }, [])

    const onEndReachedHandle = async () => {
        setIsLoadNext(true)
        if (!isloadNext) {
            await getPostNext().then(() => {
                setIsLoadNext(false)
            })
        }
    }

    const renderItem = ({ item }: ListRenderItemInfo<PostModel>) => {
        return (
            <PostCard
                item={item}
                onDeletePost={onDeletePost}
                onPressUserName={onPressHandle}
            />
        )
    }

    const renderTag = ({item}: ListRenderItemInfo<{id: number, name: string}>) => {

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

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ backgroundColor: COLORS.darkBlack, flex: 1, padding: SIZES.padding }}>
                {/* search bar */}
                <View style={{ backgroundColor: COLORS.darkGrey, borderRadius: 32, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <TextInput
                        placeholder="Search for people, posts, tags..."
                        placeholderTextColor={COLORS.socialWhite}
                        style={{ paddingHorizontal: SIZES.padding, flex: 2 }}
                    />
                    <View style={{ paddingHorizontal: SIZES.padding }}>
                        <UtilIcons.svgSearch color={COLORS.lightGrey} />
                    </View>
                </View>
                {/* body */}
                <View style={{ paddingVertical: SIZES.padding }}>
                    {/* header title */}
                    <Text style={[utilStyles.text, { ...FONTS.h3 }]}>Popular</Text>

                    {/* tags */}
                    <FlatList
                        horizontal
                        data={tagDatas}
                        contentContainerStyle={{ columnGap: SIZES.padding, paddingVertical: SIZES.base }}
                        renderItem={renderTag}
                        keyExtractor={(item, index) => item.name + index}
                    />

                    {/* content search */}
                    <FlatList
                        data={data}
                        scrollEnabled={false}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => `${item.id}_${index}`}
                        showsVerticalScrollIndicator={false}
                        refreshControl={<RefreshControl onRefresh={() => getPost()} refreshing={false} />}
                        onEndReached={onEndReachedHandle}
                        ItemSeparatorComponent={() => <Divider />}
                    />
                </View>
            </View>
        </ScrollView >
    )
}

export default SearchScreen