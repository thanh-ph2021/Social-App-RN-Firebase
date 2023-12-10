import { useState } from 'react'
import { ScrollView, Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { FONTS, COLORS, SIZES } from '../constants'
import FormInput from '../components/FormInput'
import FormButton from '../components/FormButton'
import SocialButton from '../components/SocialButton'
import useAuthContext from '../hooks/useAuthContext'

const SignUpScreen = ({ navigation }: NativeStackScreenProps<any>) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const { register } = useAuthContext()

    return (
        <ScrollView style={styles.container}>
            {/* logo */}
            <View style={styles.logo}>

                <Text style={{ ...FONTS.h2 }}>Create an account</Text>
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

            <FormInput
                iconType='lock'
                labelValue={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholderText={'Confirm Password'}
                secureTextEntry={true}
            />

            <FormButton
                buttonTitle={'Sign Up'}
                onPress={() => register(email, password)}
            />

            <View style={styles.textWrap}>
                <Text style={styles.text}>By register, you confirm that you accept our</Text>
                <TouchableOpacity>
                    <Text style={[styles.text, { color: COLORS.red }]}>Terms of service </Text>
                </TouchableOpacity>
                <Text style={styles.text}>and</Text>
                <Text style={[styles.text, { color: COLORS.red }]}> Privacy Policy</Text>
            </View>


            <SocialButton
                buttonTitle='Sign Up with Facebook'
                btnType='facebook'
                backgroundColor={COLORS.lightBlue}
                color={COLORS.blue}
                onPress={() => { }}
            />

            <SocialButton
                buttonTitle='Sign Up with Google'
                btnType='google'
                backgroundColor={COLORS.lightRed}
                color={COLORS.red}
                onPress={() => { }}
            />

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.textButton}>Have an account? Sign In</Text>
            </TouchableOpacity>

        </ScrollView>
    )
}

export default SignUpScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        paddingHorizontal: SIZES.padding
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