import { useEffect } from 'react'
import { Notifier, Easing } from 'react-native-notifier'
import PushNotificationIOS from "@react-native-community/push-notification-ios"
import PushNotification, { Importance } from 'react-native-push-notification'
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { Platform } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import BottomTabsNavigation from './BottomTabsNavigator'

import { requestUserPermission } from '../utils'
import { useAuthContext, useChat, useDevice, useUser } from '../hooks'
import { AddPostScreen, ChatScreen, CreatePageScreen, FriendScreen, ImageViewScreen, MessagesScreen, PostDetailScreen, ProfileScreen, SettingsNotificationScreen, SettingsScreen, StoryScreen, UpdateProfileScreen, VideoDetailScreen } from '../screens'

const Stack = createNativeStackNavigator()

const AppStack = () => {
    const [isLoading, collection, addDevice] = useDevice()
    const navigation = useNavigation<any>()
    const { getChatCondition } = useChat()
    const { getUserFromHook } = useUser()
    const { user, setUser } = useAuthContext()

    useEffect(() => {
        
        // configureNotification()
        createChannelNoti()

        requestUserPermission()
        const messageHelper = messaging()

        // lưu token lên firestore
        messageHelper.getToken().then(async (token) => {
            if (Platform.OS == 'ios') {
                messageHelper.getAPNSToken().then((aspnToken) => {
                    // await addDevice(token, user.uid!)
                });
            } else {
                if (user) {
                    await addDevice(token, user.uid!)
                    !user.about && await getUserFromHook(user!.uid!)
                        .then((data) => {
                            if (data) {
                                setUser({
                                    ...data,
                                    uid: user.uid,
                                    notifyToken: token,
                                })
                            }
                        })
                }
            }
        });

        messageHelper.setBackgroundMessageHandler(async remoteMessage => {
            navigate(remoteMessage)
        });

        // messageHelper.onNotificationOpenedApp(remoteMessage => {
        //     navigate(remoteMessage)
        // });

        // messageHelper
        //     .getInitialNotification()
        //     .then(remoteMessage => {
        //         navigate(remoteMessage)
        //     });

        const unsubscribe = messageHelper.onMessage(async message => {
            Notifier.showNotification({
                title: message.notification?.title,
                description: message.notification?.body,
                duration: 3000,
                showAnimationDuration: 800,
                showEasing: Easing.bounce,
                swipeEnabled: true,
            })
        });

        return () => {
            unsubscribe()
        }
    }, [])

    const handleAppStateChange = (nextAppState: any) => {

    }

    const navigate = async (message: FirebaseMessagingTypes.RemoteMessage | null) => {
        if (message) {
            switch (message.data!.type) {
                case 'message':
                    Promise.all([
                        await getUserFromHook(message.data!.id.toString()),
                        await getChatCondition(message.data!.id.toString())
                    ]).then((response) => {
                        const userData = response[0]
                        const chatID = response[1]
                        if (userData && chatID) {
                            navigation.navigate('Chat', { userData: userData, chatID: chatID })
                        }
                    })
                    break
            }
        }
    }

    const configureNotification = () => {
        PushNotification.configure({
            onRegister: function (token: any) {
                console.log("TOKEN:", token);
            },

            onNotification: function (notification: any) {
                console.log("NOTIFICATION:", notification);

                notification.finish(PushNotificationIOS.FetchResult.NoData);
            },

            onAction: function (notification: any) {
                console.log("ACTION:", notification.action);
                console.log("NOTIFICATION:", notification);

            },

            onRegistrationError: function (err: any) {
                console.error(err.message, err);
            },

            permissions: {
                alert: true,
                badge: true,
                sound: true,
            },

            popInitialNotification: true,

            requestPermissions: true,
        });
    }

    const createChannelNoti = () => {
        PushNotification.createChannel(
            {
                channelId: "channel-id",
                channelName: "Chat",
                channelDescription: "A channel chat notifications",
                playSound: true,
                soundName: "default",
                importance: Importance.HIGH,
            },
            (created: any) => {
                // console.log(`createChannel returned '${created}'`)
            }
        );
    }

    return (
        <Stack.Navigator>
            <Stack.Screen name='Home' component={BottomTabsNavigation} options={{ headerShown: false }} />
            <Stack.Screen
                name='PostDetailScreen'
                component={PostDetailScreen}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen name='ImageViewScreen' component={ImageViewScreen} options={{ headerShown: false }} />
            <Stack.Screen
                name='AddPost'
                component={AddPostScreen}
            />
            <Stack.Screen name='StoryScreen' component={StoryScreen} options={{ headerShown: false }} />
            <Stack.Screen
                name='Messages'
                component={MessagesScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name='Chat'
                component={ChatScreen}
                options={({ route }: any) => ({
                    title: route!.params!.userID ?? '',
                    headerShown: false,
                })}
            />
            <Stack.Screen
                name='Settings'
                component={SettingsScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name='CreatePage'
                component={CreatePageScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name='UpdateProfile'
                component={UpdateProfileScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name='Profile'
                component={ProfileScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name='Friends'
                component={FriendScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name='VideoDetail'
                component={VideoDetailScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name='SettingsNotification'
                component={SettingsNotificationScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    )
}

export default AppStack