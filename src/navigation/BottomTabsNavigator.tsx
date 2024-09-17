import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import LinearGradient from 'react-native-linear-gradient'
import { View } from 'react-native'

import FeedStack from './FeedStack'
import ProfileStack from './ProfileStack'
import { AddPostScreen, NotificationScreen, SearchScreen } from '../screens'
import { COLORS, SIZES } from '../constants'
import { useAppSelector } from '../hooks'
import { UtilIcons } from '../utils/icons'
import { memo } from 'react'
import Badges from '../components/Badges'

const Tab = createBottomTabNavigator()

const BottomTabsNavigation = () => {

    const { unreadCount } = useAppSelector(state => state.notificationState)

    return (
        <Tab.Navigator
            initialRouteName='HomeMain'
            screenOptions={{
                tabBarStyle: {
                    height: 60,
                    backgroundColor: COLORS.darkBlack,
                    borderBlockColor: COLORS.lightGrey
                },
                tabBarShowLabel: false,
                tabBarHideOnKeyboard: true,
                header: () => null,
                lazy: true
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
                        <View style={{ padding: SIZES.padding }}>
                            <UtilIcons.svgAlert color={focused ? COLORS.socialWhite : COLORS.darkGrey} />
                            <Badges unreadCount={unreadCount} />
                        </View>
                    ),
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

export default memo(BottomTabsNavigation)