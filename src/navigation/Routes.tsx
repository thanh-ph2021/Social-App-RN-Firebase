import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import auth from '@react-native-firebase/auth'
import AuthStack from './AuthStack.android'
import AppStack from './AppStack'
import useAuthContext from '../hooks/useAuthContext'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { NotifierWrapper } from 'react-native-notifier';
import { SafeAreaView, StatusBar } from 'react-native'
import { COLORS, SIZES } from '../constants'


const Routes = () => {

    const { user, setUser } = useAuthContext()
    const [initalizing, setInitalizing] = useState(true)

    const onAuthStateChanged = (user: any) => {
        setUser(user)
        if (initalizing) setInitalizing(false)
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged)

        return () => {
            subscriber()
        }
    }, [])


    if (initalizing) return null

    return (
        <GestureHandlerRootView style={{ flex: 1}}>
            <NotifierWrapper>
                <NavigationContainer>
                    <StatusBar backgroundColor={COLORS.darkBlack} />
                        {user ? <AppStack /> : <AuthStack />}
                </NavigationContainer>
            </NotifierWrapper>
        </GestureHandlerRootView>
    )
}

export default Routes