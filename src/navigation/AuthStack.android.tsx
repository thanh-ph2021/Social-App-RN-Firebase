import { useState, useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { OnBoardingScreen, LoginScreen, SignupScreen } from '../screens'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { TouchableOpacity } from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import { COLORS, SIZES } from '../constants'
import { GoogleSignin } from '@react-native-google-signin/google-signin'

const Stack = createNativeStackNavigator()

function AuthStack() {

    const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null)
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

        GoogleSignin.configure({
            webClientId: '974440527830-9qo5oana9fm9uelss2l62e6ekq3fd1k2.apps.googleusercontent.com',
        });
    }, [])

    if(isFirstLaunch == null){
        return null
    }

    return (
        <Stack.Navigator
            initialRouteName={isFirstLaunch ? 'OnBoarding' : 'Login'}
        >
            {isFirstLaunch && <Stack.Screen
                name="OnBoarding"
                component={OnBoardingScreen}
                options={{
                    headerShown: false
                }}
            />}
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