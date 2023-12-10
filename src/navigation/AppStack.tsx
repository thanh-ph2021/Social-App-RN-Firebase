import { useEffect, useRef } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Feather from 'react-native-vector-icons/Feather'
import * as Animatable from 'react-native-animatable'
import { ChatScreen, ProfileScreen } from '../screens'
import { COLORS, SIZES } from '../constants'
import { TouchableOpacity } from 'react-native'
import { styles } from '../styles'
import FeedStack from './FeedStack'
import MessageStack from './MessageStack'
import ProfileStack from './ProfileStack'

const Tab = createBottomTabNavigator()

const tabArray = [
    { route: 'HomeMain', label: 'HomeMain', activeIcon: 'home', component: FeedStack },
    { route: 'MessagesMain', label: 'MessagesMain', activeIcon: 'message-square', component: MessageStack },
    { route: 'ProfileMain', label: 'ProfileMain', activeIcon: 'user', component: ProfileStack },
]

const AppStack = () => {

    const TabButton = (props: any) => {

        const { item, onPress, accessibilityState } = props
        const focused = accessibilityState.selected
        const viewRef = useRef<any>(null)

        useEffect(() => {
            if (focused) {
                viewRef.current.animate({ 0: { scale: .5, rotate: '0deg' }, 1: { scale: 1, rotate: '360deg' } })
            } else {
                viewRef.current.animate({ 0: { scale: 1, rotate: '360deg' }, 1: { scale: 1, rotate: '0deg' } })
            }
        }, [focused])

        return (
            <TouchableOpacity style={styles.container} onPress={onPress}>
                <Animatable.View
                    ref={viewRef}
                    duration={1000}
                    style={styles.container}
                >
                    <Feather name={item.activeIcon} color={focused == true ? COLORS.blue : COLORS.gray} size={SIZES.icon} />
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
                },
                tabBarShowLabel: false,
                tabBarHideOnKeyboard: true,
                header: () => null
            }}
        >
            {tabArray.map((item, index) => {
                return (
                    <Tab.Screen
                        key={index}
                        name={item.route}
                        component={item.component}
                        options={{
                            tabBarIcon: ({ color, focused }) => <Feather name={item.activeIcon} color={focused ? COLORS.blue : COLORS.gray} size={SIZES.icon} />,
                            tabBarButton: (props) => <TabButton {...props} item={item} />
                        }}
                    />
                )
            })}
        </Tab.Navigator>
    )
}

export default AppStack