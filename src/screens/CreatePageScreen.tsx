import { StyleSheet, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useEffect, useState } from 'react'

import { getUser } from '../utils'
import { COLORS, SIZES } from '../constants'
import { TextComponent } from '../components'
import { useAuthContext } from '../hooks'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

const CreatePageScreen = ({ navigation }: NativeStackScreenProps<any>) => {

    const { user, logout } = useAuthContext()

    useEffect(() => {
        // getUser()
    }, [])

    return (
        <View style={styles.container}>
            <View style={{ width: SIZES.width, height: 50, backgroundColor: 'blue' }} />
            <TextComponent text={'hellofjldasjfldjalkfjdklasjfld'} />
        </View>
    )
}

export default CreatePageScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.darkBlack,
        justifyContent: 'center',
        alignItems: 'center',
    },

    button: {
        width: '100%',
        backgroundColor: COLORS.darkGrey,
        padding: SIZES.padding,
        marginVertical: SIZES.padding
    }
})