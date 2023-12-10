import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import auth from '@react-native-firebase/auth'

import AuthStack from './AuthStack.android'
import AppStack from './AppStack'
import useAuthContext from '../hooks/useAuthContext'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

const Routes = () => {

    const { user, setUser } = useAuthContext()
    const [initalizing, setInitalizing] = useState(true)

    const onAuthStateChanged = (user: any) => {
        setUser(user)
        if (initalizing) setInitalizing(false)
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged)

        return subscriber
    }, [])

    if (initalizing) return null

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <NavigationContainer>
                {user ? <AppStack /> : <AuthStack />}
            </NavigationContainer>
        </GestureHandlerRootView>
    )
}

export default Routes