import { useState, useEffect, useCallback } from 'react'
import { Image, Text, View, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, ListRenderItemInfo, FlatList } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import useAuthContext from '../hooks/useAuthContext'
import { COLORS, SIZES, images, FONTS } from '../constants'
import firestore from '@react-native-firebase/firestore'
import PostCard from '../components/Post/PostCard'
import { deletePost } from '../utils'
import { UserModel } from '../models'
import { useFocusEffect } from '@react-navigation/native'
import { useChat, usePost } from '../hooks'
import LinearGradient from 'react-native-linear-gradient'
import { utilStyles } from '../styles'

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

    const { user, logout } = useAuthContext()
    const [isDelete, setIsDelete] = useState<boolean>(false)
    const params = route.params
    const [userData, setUserData] = useState<UserModel>()
    const { data, getPostByUserID } = usePost()
    const { addChatData } = useChat()
    const [tag, setTag] = useState<number>(1)

    useFocusEffect(
        useCallback(() => {
            getUser()
            getPostByUserID(params ? params.userID : user!.uid)
            return () => {
                // Cleanup function if needed
            };
        }, [])
    );

    useEffect(() => {
        getUser()
    }, [])

    useEffect(() => {
        getPostByUserID(params ? params.userID : user!.uid)
    }, [isDelete])

    const getUser = async () => {
        await firestore()
            .collection('users')
            .doc(params ? params.userID : user!.uid)
            .get()
            .then((documentSnapshot) => {
                if (documentSnapshot.exists) {
                    setUserData({
                        ...documentSnapshot.data(),
                        uid: documentSnapshot.id
                    })
                }
            })
    }

    const navigateChatScreen = (chatID: string) => {
        navigation.navigate('Chat', { userData: userData, chatID: chatID })
    }

    const renderTag = ({ item }: ListRenderItemInfo<{ id: number, name: string }>) => {

        const onPress = () => {
            setTag(item.id)
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

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>

                {/* banner */}
                <View>
                    <Image source={images.OnBoarding02} resizeMode='cover' style={{ height: 160, width: '100%' }} />
                    <LinearGradient colors={[COLORS.gradient[0], COLORS.gradient[1]]} style={styles.avatarStyle}>
                        {userData?.userImg ? <Image source={{ uri: userData?.userImg }} style={styles.image} resizeMode='cover' /> : (
                            <Image source={images.defaultImage} style={styles.image} resizeMode='cover' />
                        )}
                    </LinearGradient>
                </View>

                <Text style={styles.textTitle}>
                    {/* {userData?.fname} {userData?.lname} */}
                    Alex Tsimikas
                </Text>

                {/* address */}
                <Text style={styles.textAddress}>
                    {/* {userData?.about} */}
                    Brooklyn, NY
                </Text>

                {/* bio */}

                <Text style={styles.text}>
                    {/* {userData?.about} */}
                    Writer by Profession. Artist by Passion!
                </Text>

                {/* button */}
                {/* <View style={styles.buttonWrap}>
                    {params && params.userID && user!.uid != params.userID ? (
                        <>
                            <TouchableOpacity style={styles.button} onPress={() => addChatData(params?.userID, navigateChatScreen)}>
                                <Text style={styles.buttonText}>Message</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => logout()}>
                                <Text style={styles.buttonText}>Follow</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('UpdateProfile')}>
                                <Text style={styles.buttonText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => logout()}>
                                <Text style={styles.buttonText}>Logout</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View> */}

                {/* information */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', marginVertical: SIZES.padding }}>

                    <View style={styles.contentStyle}>
                        <Text style={styles.text}>2,467</Text>
                        <Text style={[styles.text, { color: COLORS.lightGrey }]}>Followers</Text>
                    </View>
                    <View style={styles.contentStyle}>
                        <Text style={styles.text}>1,589</Text>
                        <Text style={[styles.text, { color: COLORS.lightGrey }]}>Following</Text>
                    </View>

                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('UpdateProfile')}>
                        <Text style={styles.buttonText}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>

                {/* tags */}
                <FlatList
                    horizontal
                    data={tagDatas}
                    style={{
                        borderBottomColor: COLORS.lightGrey,
                        borderBottomWidth: 1,
                        marginHorizontal: SIZES.padding
                    }}
                    contentContainerStyle={{
                        justifyContent: 'space-between',
                        flex: 1
                    }}
                    renderItem={renderTag}
                    keyExtractor={(item, index) => item.name + index}
                />

                {
                    data.map(item => {
                        return (
                            <PostCard item={item} onDeletePost={(post) => deletePost(post.id, setIsDelete)} key={item.id} />
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
        marginHorizontal: SIZES.padding
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
    }
})