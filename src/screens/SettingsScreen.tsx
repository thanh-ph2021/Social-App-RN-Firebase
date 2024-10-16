import { StyleSheet, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useEffect } from 'react'

import { COLORS, FONTS, SIZES } from '../constants'
import { Header, TextComponent } from '../components'
import { useAuthContext } from '../hooks'
import { UtilIcons } from '../utils/icons'
import { utilStyles } from '../styles'
import FormButton from '../components/FormButton'
import { showNotificationComingSoon } from '../utils'

const settings = [
    'Account',
    'Privacy',
    'Notifications',
    'Blocked User',
    'About'
]

const SettingsScreen = ({ navigation }: NativeStackScreenProps<any>) => {

    const { user, logout } = useAuthContext()

    useEffect(() => {
        // getUser()
    }, [])

    const handlePress = (str: string) => {
        switch (str) {
            case settings[0]:
                showNotificationComingSoon()
                break
            case settings[1]:
                showNotificationComingSoon()
                break
            case settings[2]:
                //notification
                navigation.navigate('SettingsNotification')
                break
            case settings[3]:
                showNotificationComingSoon()
                break
            case settings[4]:
                showNotificationComingSoon()
                break
        }
    }

    return (
        <View style={styles.container}>
            <Header
                title={'Settings'}
                leftComponent={
                    <TouchableOpacity style={utilStyles.btnHeaderLeft} onPress={() => navigation.goBack()}>
                        <UtilIcons.svgArrowLeft color={COLORS.socialWhite} />
                    </TouchableOpacity>
                }
            />

            {settings.map((item, index) => {
                return (
                    <TouchableOpacity key={index} style={styles.button} onPress={() => handlePress(item)}>
                        <TextComponent text={item} color={COLORS.socialWhite} style={{ ...FONTS.body3 }} />
                    </TouchableOpacity>
                )
            })}

            <FormButton
                buttonTitle={'Logout'}
                onPress={() => logout()}
                style={{
                    backgroundColor: COLORS.socialPink,
                    padding: SIZES.padding,
                    margin: SIZES.padding,
                    borderRadius: SIZES.base,
                    alignItems: 'center',
                    position: 'absolute',
                    bottom: 10,
                    right: 0,
                    left: 0
                }}
            />
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
        padding: SIZES.padding,
    }
})