import { useEffect, useState } from 'react'
import { Alert, FlatList, ListRenderItemInfo, RefreshControl, SafeAreaView, View } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Container } from '../styles/FeedStyles'
import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage'
import PostCard from '../components/PostCard'
import { PostModel } from '../Models'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
import { SIZES, images } from '../constants'
import { styles } from '../styles'
import { deletePost } from '../utils'
import { usePost } from '../hooks'

export const LoadScreen = () => {
    return (
        <View style={styles.container}>
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
                            <View style={{ marginBottom: SIZES.base, width: SIZES.width - 50, height: 20, borderRadius: SIZES.base }} />
                            <View style={{ width: SIZES.width - 50, height: 20, borderRadius: SIZES.base }} />
                        </View>

                        <View style={{ width: SIZES.width - 50, height: 200, borderRadius: SIZES.base }} />
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
                            <View style={{ marginBottom: SIZES.base, width: SIZES.width - 50, height: 20, borderRadius: SIZES.base }} />
                            <View style={{ width: SIZES.width - 50, height: 20, borderRadius: SIZES.base }} />
                        </View>

                        <View style={{ width: SIZES.width - 50, height: 200, borderRadius: SIZES.base }} />
                    </View>
                </View>
            </SkeletonPlaceholder>
        </View>

    )
}

const HomeScreen = ({ navigation }: NativeStackScreenProps<any>) => {

    const [isDelete, setIsDelete] = useState<boolean>(false)
    const [data, isLoading, collection, getPost] = usePost()

    useEffect(() => {
        getPost()
        setIsDelete(false)
    }, [isDelete])

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {isLoading ? <LoadScreen />
                : (
                    <Container>
                        <FlatList
                            data={data}
                            renderItem={({ item }: ListRenderItemInfo<PostModel>) => (
                                <PostCard
                                    item={item}
                                    onDelete={(postID) => deletePost(postID, setIsDelete)}
                                    onPress={() => navigation.navigate('Profile', { userID: item.userID })}
                                />
                            )}
                            keyExtractor={(item) => `${item.id}`}
                            ListFooterComponent={() => <View style={{ height: 60 }} />}
                            showsVerticalScrollIndicator={false}
                            refreshControl={<RefreshControl onRefresh={() => getPost()} refreshing={false} />}
                        />
                    </Container>
                )}
        </SafeAreaView>
    )
}

export default HomeScreen