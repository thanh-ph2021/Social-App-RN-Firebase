import { StyleSheet, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useEffect } from 'react'

import { getUser } from '../utils'
import { COLORS, SIZES } from '../constants'
import { TextComponent } from '../components'
import { useAuthContext } from '../hooks'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

const SettingsScreen = ({ navigation }: NativeStackScreenProps<any>) => {

    const { user, logout } = useAuthContext()

    useEffect(() => {
        // getUser()
    }, [])
    
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={() => logout()}>
                <TextComponent text='Log out' color={COLORS.socialPink}/>
            </TouchableOpacity>
        </View>
    )
}

export default SettingsScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.darkBlack
    },

    button: {
        width: '100%',
        backgroundColor: COLORS.darkGrey,
        padding: SIZES.padding,
        marginVertical: SIZES.padding
    }
})