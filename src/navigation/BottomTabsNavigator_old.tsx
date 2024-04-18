import { useRef, useEffect } from 'react'
import { Alert, AppState, Image, Platform, View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import * as Animatable from 'react-native-animatable'
import { COLORS, SIZES, images } from '../constants'
import { TouchableOpacity } from 'react-native'
import { utilStyles } from '../styles'
import FeedStack from './FeedStack'
import MessageStack from './MessageStack'
import ProfileStack from './ProfileStack'
import { NotificationScreen } from '../screens'
import { Icon, TypeIcons } from '../components'
import { useAuthContext, useChat, useDevice, useUser } from '../hooks'

const Tab = createBottomTabNavigator()

const tabArray = [
    { route: 'HomeMain', label: 'HomeMain', activeIcon: 'home-outline', typeIcon: TypeIcons.Ionicons, component: FeedStack },
    { route: 'MessagesMain', label: 'MessagesMain', activeIcon: 'chatbubble-ellipses-outline', typeIcon: TypeIcons.Ionicons, component: MessageStack },
    { route: 'Notification', label: 'Notification', activeIcon: 'notifications-outline', typeIcon: TypeIcons.Ionicons, component: NotificationScreen },
    { route: 'ProfileMain', label: 'ProfileMain', activeIcon: 'person-circle', typeIcon: TypeIcons.Ionicons, component: ProfileStack },
]

const BottomTabsNavigation = () => {
    
    const { user } = useAuthContext()

    const TabButton = (props: any) => {

        const { item, onPress, accessibilityState } = props
        const focused = accessibilityState.selected
        const viewRef = useRef<any>(null)

        useEffect(() => {
            if (focused) {
                viewRef.current.animate({ 0: { scale: 1, rotate: '0deg' }, 1: { scale: 1, rotate: '360deg' } })
            }
        }, [focused])

        return (
            <TouchableOpacity style={utilStyles.container} onPress={onPress}>
                <Animatable.View
                    ref={viewRef}
                    duration={1000}
                    style={utilStyles.container}
                >
                    <Icon type={item.typeIcon} name={item.activeIcon} color={focused == true ? COLORS.socialWhite : COLORS.lightGrey} size={SIZES.icon} />
                </Animatable.View>
            </TouchableOpacity>
        )
    }

    return (
        <Tab.Navigator
            initialRouteName='Home'
            screenOptions={{
                tabBarStyle: {
                    height: 60,
                    // position: 'absolute',
                    // bottom: SIZES.padding,
                    // left: SIZES.padding,
                    // right: SIZES.padding,
                    // borderRadius: SIZES.base,
                    backgroundColor: COLORS.darkBlack,
                    borderBlockColor: COLORS.lightGrey
                },
                
                tabBarShowLabel: false,
                tabBarHideOnKeyboard: true,
                header: () => null,
                lazy: true,
                
            }}
        >
            {tabArray.map((item, index) => {
                return (
                    <Tab.Screen
                        key={index}
                        name={item.route}
                        component={item.component}
                        options={{
                            tabBarIcon: ({ color, focused }) => <Icon type={item.typeIcon} name={item.activeIcon} color={focused ? COLORS.blue : COLORS.darkGrey} size={SIZES.icon} />,
                            tabBarButton: (props) => user?.userImg && item.label == 'ProfileMain' ? (
                                <TouchableOpacity style={utilStyles.container} onPress={props.onPress}>
                                    <Image source={{ uri: user?.userImg }} style={{
                                        width: 30,
                                        height: 30,
                                        borderRadius: 30,
                                        borderWidth: 2,
                                        borderColor: props.accessibilityState?.selected ? COLORS.blue : COLORS.darkBlack
                                    }} />
                                </TouchableOpacity>

                            ) : (
                                <TabButton {...props} item={item} />
                            )
                        }}
                    />
                )
            })}
        </Tab.Navigator>
    )
}

export default BottomTabsNavigation