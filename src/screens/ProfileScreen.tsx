import { useState, useEffect, useCallback } from 'react'
import { Image, Text, View, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import useAuthContext from '../hooks/useAuthContext'
import { COLORS, SIZES, images, FONTS } from '../constants'
import firestore from '@react-native-firebase/firestore'
import PostCard from '../components/PostCard'
import { deletePost } from '../utils'
import { UserModel } from '../Models'
import { useFocusEffect } from '@react-navigation/native'
import { useChat, usePost } from '../hooks'

const ProfileScreen = ({ navigation, route }: NativeStackScreenProps<any>) => {

    const { user, logout } = useAuthContext()
    const [isDelete, setIsDelete] = useState<boolean>(false)
    const params = route.params
    const [userData, setUserData] = useState<UserModel>()
    const chatsCollection = firestore().collection('Chats')
    const [data, isLoading, collection, getPost, getPostByUserID, addPost] = usePost()
    const [chatData, messages, setMessages, isLoadingChat, collectionChat, getChat, addChatData, updateChat, addMessage, loadMessageRealTime] = useChat()

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
                    setUserData(documentSnapshot.data())
                }
            })
    }

    const navigateChatScreen = (chatID: string) => {
        navigation.navigate('Chat', { userData: userData, userID: params?.userID, chatID: chatID })
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {userData?.userImg ? <Image source={{ uri: userData?.userImg }} style={styles.image} resizeMode='cover' /> : (
                    <Image source={images.defaultImage} style={styles.image} resizeMode='cover' />
                )}
                <Text style={styles.textTitle}>
                    {userData?.fname} {userData?.lname}
                </Text>

                <Text style={styles.text}>
                    {userData?.about}
                </Text>

                {/* button */}
                <View style={styles.buttonWrap}>
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
                </View>

                {/* information */}
                <View style={{ flexDirection: 'row', alignSelf: 'center', marginBottom: SIZES.base }}>
                    <View style={styles.contentStyle}>
                        <Text style={styles.textTitle}>{data.length}</Text>
                        <Text style={styles.text}>Posts</Text>
                    </View>
                    <View style={styles.contentStyle}>
                        <Text style={styles.textTitle}>{0}</Text>
                        <Text style={styles.text}>Following</Text>
                    </View>
                    <View style={styles.contentStyle}>
                        <Text style={styles.textTitle}>{0}</Text>
                        <Text style={styles.text}>Follower</Text>
                    </View>
                </View>
                {
                    data.map(item => {
                        return (
                            <PostCard item={item} onDelete={(postID) => deletePost(postID, setIsDelete)} key={item.id} />
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
        padding: SIZES.base
    },
    image: {
        width: SIZES.width * 0.3,
        height: SIZES.width * 0.3,
        borderRadius: SIZES.width / 0.25,
        alignSelf: 'center'
    },

    textTitle: {
        ...FONTS.h2,
        textAlign: 'center',
        color: COLORS.black,
        paddingTop: SIZES.base
    },

    text: {
        ...FONTS.body3,
        textAlign: 'center',
        color: COLORS.black,
    },

    buttonWrap: {
        flexDirection: 'row',
        marginTop: SIZES.base,
        alignSelf: 'center'
    },

    button: {
        borderColor: COLORS.blue,
        borderWidth: 2,
        borderRadius: SIZES.radius,
        alignSelf: 'center',
        marginHorizontal: SIZES.base
    },

    buttonText: {
        ...FONTS.body3,
        textAlign: 'center',
        color: COLORS.blue,
        padding: SIZES.base,
    },

    contentStyle: {
        paddingHorizontal: SIZES.padding * 2
    }

})