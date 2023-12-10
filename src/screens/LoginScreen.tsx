import { useContext, useState } from 'react'
import { ScrollView, Image, Text, View, StyleSheet, Button, TouchableOpacity, Platform } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { images, FONTS, COLORS, SIZES } from '../constants'
import FormInput from '../components/FormInput'
import FormButton from '../components/FormButton'
import SocialButton from '../components/SocialButton'
import useAuthContext from '../hooks/useAuthContext'

const LoginScreen = ({ navigation }: NativeStackScreenProps<any>) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { login, googleLogin, facebookLogin } = useAuthContext()

    return (
        <ScrollView style={styles.container}>

            <View style={styles.logo}>
                <Image source={images.OnBoarding01} style={styles.image} />
                <Text style={{ ...FONTS.h2 }}>Social App</Text>
            </View>

            <FormInput
                iconType='user'
                labelValue={email}
                onChangeText={setEmail}
                placeholderText={'Email'}
                keyboardType='email-address'
                autoCapitalize='none'
                autoCorrect={false}
            />

            <FormInput
                iconType='lock'
                labelValue={password}
                onChangeText={setPassword}
                placeholderText={'Password'}
                secureTextEntry={true}
            />

            <FormButton
                buttonTitle={'Login'}
                onPress={() => login(email, password)}
            />

            <TouchableOpacity style={styles.button}>
                <Text style={styles.textButton}>Forgot Password?</Text>
            </TouchableOpacity>

            {Platform.OS == 'android' ? (
                <View>
                    <SocialButton
                        buttonTitle='Sign In with Facebook'
                        btnType='facebook'
                        backgroundColor={COLORS.lightBlue}
                        color={COLORS.blue}
                        onPress={() => facebookLogin()}
                    />

                    <SocialButton
                        buttonTitle='Sign In with Google'
                        btnType='google'
                        backgroundColor={COLORS.lightRed}
                        color={COLORS.red}
                        onPress={() => googleLogin()}
                    />
                </View>
            ) : <></>}

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.textButton}>Don't have an account? Create here</Text>
            </TouchableOpacity>

        </ScrollView>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        padding: SIZES.padding
    },

    logo: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    image: {
        width: SIZES.width * 0.5,
        height: SIZES.height * 0.2
    },

    button: {
        margin: SIZES.padding * 3,
        alignItems: 'center'
    },
    textButton: {
        color: COLORS.blue,
        ...FONTS.body3
    }
})