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

const ForgotPasswordScreen = ({ navigation }: NativeStackScreenProps<any>) => {

    const [email, setEmail] = useState('')
    const [upLoading, setUpLoading] = useState<boolean>(false)
    const { sendPasswordResetEmail } = useAuthContext()

    const handleRegister = async () => {
        console.log(email)
        if (email === '') {
            showNotification("Email isn't empty!", UtilIcons.warning, 'warning')
            return
        }

        setUpLoading(true)
        await sendPasswordResetEmail(email.trim())
        setUpLoading(false)
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
                    <TextComponent text={'Forgot password'} style={{ ...FONTS.h1 }} />
                    <TextComponent text={'Please enter your email to reset the password'} style={{ ...FONTS.body4, marginVertical: SIZES.padding, textAlign: 'center' }} />
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

                <FormButton
                    buttonTitle={'Send password reset link'}
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
                    <TextComponent
                        text="If you don’t see the email in your inbox, please check your spam folder"
                        style={{ ...FONTS.body4, paddingRight: SIZES.base, textAlign: 'center' }}
                    />
                </View>
            </KeyboardAvoidingView>
            {renderModal()}
        </ScrollView>
    )
}

export default ForgotPasswordScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.darkBlack,
        alignItems: 'center',
        justifyContent: 'center'
    },
})