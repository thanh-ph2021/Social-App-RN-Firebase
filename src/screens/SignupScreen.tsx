import React, { useState } from 'react'
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Modal, ActivityIndicator } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { FONTS, COLORS, SIZES } from '../constants'
import FormInput from '../components/FormInput'
import FormButton from '../components/FormButton'
import useAuthContext from '../hooks/useAuthContext'
import { Header, TextComponent } from '../components'
import { UtilIcons } from '../utils/icons'
import { utilStyles } from '../styles'
import { showNotification } from '../utils'

const SignUpScreen = ({ navigation }: NativeStackScreenProps<any>) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [upLoading, setUpLoading] = useState<boolean>(false)
    const { register } = useAuthContext()

    const handleRegister = async () => {
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

        if (confirmPassword === '') {
            isValid = false
            showNotification("Confirm Password isn't empty!", UtilIcons.warning, 'warning')
            return
        }

        if (password !== confirmPassword) {
            isValid = false
            showNotification("Password doesn't match!", UtilIcons.warning, 'warning')
            return
        }

        if (isValid) {
            setUpLoading(true)

            await register(email.trim(), password.trim())

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
            <Header
                leftComponent={
                    <TouchableOpacity style={utilStyles.btnHeaderLeft} onPress={() => navigation.goBack()}>
                        <UtilIcons.svgArrowLeft color={COLORS.socialWhite} />
                    </TouchableOpacity>
                }
                title={''}
                containerStyle={{ position: 'absolute', top: 0, left: 0 }}
            />
            <KeyboardAvoidingView style={{
                width: '90%',
                height: '70%',
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

                <View style={{ alignItems: 'center', padding: SIZES.padding * 2 }}>
                    <TextComponent text={'Sign Up'} style={{ ...FONTS.h1 }} />
                    <TextComponent text={'Create an account to continue!'} style={{ ...FONTS.body4, marginVertical: SIZES.padding }} />
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

                <FormInput
                    labelValue={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholderText={'Confirm Password'}
                    secureTextEntry={true}
                    containerStyle={{ paddingHorizontal: SIZES.padding }}
                    inputStyle={{ width: '100%' }}
                    inputContainerStyle={{ backgroundColor: COLORS.darkBlack }}
                />

                <FormButton
                    buttonTitle={'Register'}
                    onPress={handleRegister}
                    style={{
                        backgroundColor: COLORS.socialPink,
                        padding: SIZES.padding + 1,
                        marginHorizontal: SIZES.padding,
                        marginVertical: SIZES.padding * 1.5,
                        borderRadius: SIZES.base,
                        alignItems: 'center',
                    }}
                />

                <View style={{ flexDirection: 'row', justifyContent: 'center', padding: SIZES.padding }}>
                    <TextComponent text="Already have an account?" style={{ ...FONTS.body4, paddingRight: SIZES.base }} />
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <TextComponent text="Login" style={{ ...FONTS.body4, fontWeight: 'bold' }} color={COLORS.socialPink} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
            {renderModal()}
        </ScrollView>
    )
}

export default SignUpScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.darkBlack,
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SIZES.padding * 2
    },
    button: {
        marginVertical: SIZES.padding * 3,
        alignItems: 'center'
    },
    textButton: {
        color: COLORS.blue,
        ...FONTS.body3
    },
    textWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginVertical: SIZES.padding * 2
    },
    text: {
        ...FONTS.body3
    }
})