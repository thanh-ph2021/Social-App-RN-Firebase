import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import auth from '@react-native-firebase/auth'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { NotifierWrapper } from 'react-native-notifier'
import { StatusBar } from 'react-native'
import { Provider } from 'react-redux'

import AuthStack from './AuthStack.android'
import AppStack from './AppStack'
import store from '../redux/store'
import useAuthContext from '../hooks/useAuthContext'
import { COLORS } from '../constants'


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
        <Provider store={store}>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <NotifierWrapper>
                    <NavigationContainer>
                        <StatusBar backgroundColor={COLORS.darkBlack} />
                        {user ? <AppStack /> : <AuthStack />}
                    </NavigationContainer>
                </NotifierWrapper>
            </GestureHandlerRootView>
        </Provider>
    )
}

export default Routes