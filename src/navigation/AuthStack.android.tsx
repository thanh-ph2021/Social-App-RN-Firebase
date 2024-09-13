import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { GoogleSignin } from '@react-native-google-signin/google-signin'

import { ForgotPasswordScreen, LoginScreen, OnBoardingScreen, SignupScreen } from '../screens'

const Stack = createNativeStackNavigator()

function AuthStack() {

    const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null)

    useEffect(() => {

        const checkFirstLaunch = async () => {
            try {
                const value = await AsyncStorage.getItem('alreadyLaunched')
                if (value === null) {
                    await AsyncStorage.setItem('alreadyLaunched', 'true')
                    setIsFirstLaunch(true)
                } else {
                    setIsFirstLaunch(false)
                }
            } catch (error) {
                console.log("🚀 ~ checkFirstLaunch ~ error:", error)
            }
        }

        checkFirstLaunch()

        GoogleSignin.configure({
            webClientId: '974440527830-9qo5oana9fm9uelss2l62e6ekq3fd1k2.apps.googleusercontent.com',
        });
    }, [])

    if (isFirstLaunch === null) {
        return null
    }

    return (
        <Stack.Navigator>
            {isFirstLaunch ? (
                <Stack.Screen
                    name="OnBoarding"
                    component={OnBoardingScreen}
                    options={{ headerShown: false }}
                />
            ) : null}
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
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="ForgotPassword"
                component={ForgotPasswordScreen}
                options={{
                    headerShown: false
                }}
            />
        </Stack.Navigator>
    );
}

export default AuthStack