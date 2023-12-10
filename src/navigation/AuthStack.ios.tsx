import { useState, useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { OnBoardingScreen, LoginScreen, SignupScreen } from '../screens'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { TouchableOpacity } from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import { COLORS, SIZES } from '../constants'

const Stack = createNativeStackNavigator()

function AuthStack() {

    const [isFirstLaunch, setIsFirstLaunch] = useState<boolean>(false)
    let routeName

    useEffect(() => {
        AsyncStorage.getItem('alreadyLaunched').then(value => {
            if (value == null) {
                AsyncStorage.setItem('alreadyLaunched', 'true')
                setIsFirstLaunch(true)
            } else {
                setIsFirstLaunch(false)
            }
        })
    }, [])

    if (isFirstLaunch) {
        routeName = 'OnBoarding'
    } else {
        routeName = 'Login'
    }

    return (
        <Stack.Navigator
            initialRouteName={routeName}
        >
            <Stack.Screen
                name="OnBoarding"
                component={OnBoardingScreen}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="Signup"
                component={SignupScreen}
                options={({ navigation }) => ({
                    title: '',
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Feather
                                name='arrow-left'
                                size={SIZES.icon}
                                color={COLORS.black}
                            />
                        </TouchableOpacity>
                    )
                })}
            />
        </Stack.Navigator>
    );
}

export default AuthStack