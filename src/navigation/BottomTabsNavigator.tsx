import { useRef, useEffect } from 'react'
import { Alert, AppState, Image, Platform, Text, View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import * as Animatable from 'react-native-animatable'
import { COLORS, SIZES, images } from '../constants'
import { TouchableOpacity } from 'react-native'
import { utilStyles } from '../styles'
import FeedStack from './FeedStack'
import MessageStack from './MessageStack'
import ProfileStack from './ProfileStack'
import { AddPostScreen, NotificationScreen, SearchScreen } from '../screens'
import { Icon, TypeIcons } from '../components'
import { useAuthContext, useChat, useDevice, useUser } from '../hooks'
import LinearGradient from 'react-native-linear-gradient'
import { UtilIcons } from '../utils/icons'

const Tab = createBottomTabNavigator()

const BottomTabsNavigation = () => {

    const { user } = useAuthContext()

    const TabButton = ({ children, onPress }: any) => {

        return (
            <TouchableOpacity
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    elevation: 8,
                }}
                onPress={onPress}>
                <LinearGradient
                    colors={[COLORS.gradient[0], COLORS.gradient[1]]}
                    style={{ width: 40, height: 40, borderRadius: 32 }}>
                    {children}
                </LinearGradient>
            </TouchableOpacity>
        )
    }

    return (
        <Tab.Navigator
            initialRouteName='Home'
            screenOptions={{
                tabBarStyle: {
                    height: 60,
                    backgroundColor: COLORS.darkBlack,
                    borderBlockColor: COLORS.lightGrey
                },
                tabBarShowLabel: false,
                tabBarHideOnKeyboard: true,
                header: () => null,
                lazy: true,

            }}
        >

            <Tab.Screen
                name="HomeMain"
                component={FeedStack}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <UtilIcons.svgFeed color={focused ? COLORS.socialWhite : COLORS.darkGrey} />
                    )
                }}
            />
            <Tab.Screen
                name="SearchMain"
                component={SearchScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <UtilIcons.svgSearch color={focused ? COLORS.socialWhite : COLORS.darkGrey} />
                    )
                }}
            />
            <Tab.Screen
                name="AddPost"
                component={AddPostScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <LinearGradient
                            colors={[COLORS.gradient[0], COLORS.gradient[1]]}
                            style={{ width: 40, height: 40, borderRadius: 32, justifyContent: 'center', alignItems: 'center' }}>
                            <UtilIcons.svgPlus />
                        </LinearGradient>
                    ),
                }}
            />
            <Tab.Screen
                name="Notification"
                component={NotificationScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <UtilIcons.svgAlert color={focused ? COLORS.socialWhite : COLORS.darkGrey} />
                    )
                }}
            />
            <Tab.Screen
                name="ProfileMain"
                component={ProfileStack}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <UtilIcons.svgProfile color={focused ? COLORS.socialWhite : COLORS.darkGrey} />
                    )
                }}
            />

        </Tab.Navigator>
    )
}

export default BottomTabsNavigation