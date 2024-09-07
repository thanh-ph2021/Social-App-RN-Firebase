import { useState } from 'react'
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Modal, ActivityIndicator } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { images, FONTS, COLORS, SIZES } from '../constants'
import FormInput from '../components/FormInput'
import FormButton from '../components/FormButton'
import SocialButton from '../components/SocialButton'
import useAuthContext from '../hooks/useAuthContext'
import { UtilIcons } from '../utils/icons'
import { TextComponent } from '../components'
import { showNotification } from '../utils'

const LoginScreen = ({ navigation }: NativeStackScreenProps<any>) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [upLoading, setUpLoading] = useState<boolean>(false)
    const { login, googleLogin, facebookLogin } = useAuthContext()

    const handleLogin = async () => {
        let isValid = true
        if (email === '') {
            isValid = false
            showNotification("Email isn't empty!", UtilIcons.warning, 'warning')
            return
        }

        if (password === '') {
            isValid = false
            showNotification("Password isn't empty!", UtilIcons.warning, 'warning')
            return
        }

        if (isValid) {
            setUpLoading(true)

            await login(email.trim(), password.trim())

            setUpLoading(false)
        }
    }

    const renderModal = () => {
        return (
            <Modal visible={upLoading} transparent>
                <View style={{ backgroundColor: 'rgba(0,0,0,0.5)', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ width: 200, height: 100, backgroundColor: COLORS.white, borderRadius: SIZES.base, alignItems: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator size='large' color={COLORS.blue} />
                        <Text style={{ ...FONTS.body3, padding: SIZES.base }}>Processing ... </Text>
                    </View>
                </View>
            </Modal>
        )
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <KeyboardAvoidingView style={{
                width: '90%',
                height: '85%',
                borderRadius: 12,
                overflow: 'hidden',
                borderColor: COLORS.darkGrey,
                borderWidth: 0.5
            }}>
                <View style={{
                    backgroundColor: COLORS.lightGrey,
                    opacity: 0.8,
                    position: 'absolute',
                    width: '100%',
                    height: '100%',

                }} />

                <View style={styles.logo}>
                    <UtilIcons.svgLogo size={50} color={COLORS.socialPink} />
                </View>

                <View style={{ alignItems: 'center' }}>
                    <TextComponent text={'Login'} style={{ ...FONTS.h1, paddingBottom: SIZES.padding }} />
                    <TextComponent text={'Enter your email and password to log in '} style={{ ...FONTS.body4, marginBottom: SIZES.padding * 2 }} />
                </View>

                <FormInput
                    labelValue={email}
                    onChangeText={setEmail}
                    placeholderText={'Email'}
                    keyboardType='email-address'
                    autoCapitalize='none'
                    autoCorrect={false}
                    containerStyle={{ paddingVertical: 0, paddingHorizontal: SIZES.padding }}
                    inputStyle={{ width: '100%' }}
                    inputContainerStyle={{ backgroundColor: COLORS.darkBlack }}
                />

                <FormInput
                    labelValue={password}
                    onChangeText={setPassword}
                    placeholderText={'Password'}
                    secureTextEntry={true}
                    containerStyle={{ paddingHorizontal: SIZES.padding }}
                    inputStyle={{ width: '100%' }}
                    inputContainerStyle={{ backgroundColor: COLORS.darkBlack }}
                />

                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: '100%', padding: SIZES.padding, alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                        <TextComponent text='Forgot Password?' style={styles.textButton} />
                    </TouchableOpacity>
                </View>

                <FormButton
                    buttonTitle={'Log In'}
                    onPress={handleLogin}
                    style={{
                        backgroundColor: COLORS.socialPink,
                        padding: SIZES.padding + 1,
                        marginHorizontal: SIZES.padding,
                        marginVertical: SIZES.padding * 1.5,
                        borderRadius: SIZES.base,
                        alignItems: 'center',
                    }}
                />

                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ width: '20%', height: 1, backgroundColor: COLORS.darkGrey }} />
                    <TextComponent text={'Or login with'} style={{ ...FONTS.body4, paddingHorizontal: SIZES.padding }} />
                    <View style={{ width: '20%', height: 1, backgroundColor: COLORS.darkGrey }} />
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center', gap: SIZES.padding }}>
                    <SocialButton
                        image={images.iconFacebook}
                        imageSize={20}
                        backgroundColor={COLORS.socialWhite}
                        onPress={() => facebookLogin()}
                    />

                    <SocialButton
                        image={images.iconGoogle}
                        imageSize={20}
                        backgroundColor={COLORS.socialWhite}
                        onPress={() => googleLogin()}
                    />
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center', padding: SIZES.padding }}>
                    <TextComponent text="Don't have an account?" style={{ ...FONTS.body4, paddingRight: SIZES.base }} />
                    <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                        <TextComponent text="Sign Up" style={{ ...FONTS.body4, fontWeight: 'bold' }} color={COLORS.socialPink} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
            {renderModal()}
        </ScrollView>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.darkBlack,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    logo: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: SIZES.padding * 2,
    },

    textButton: {
        color: COLORS.socialPink,
        ...FONTS.body4
    }
})