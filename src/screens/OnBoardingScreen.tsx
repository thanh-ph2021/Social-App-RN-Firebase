import Onboarding from 'react-native-onboarding-swiper';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { images, FONTS, COLORS, SIZES } from '../constants'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '../components';

const OnBoardingScreen = ({ navigation }: NativeStackScreenProps<any>) => {

    const Skip = ({ ...props }) => {
        return (
            <Button onPress={props.onPress} title={props.nextLabel ?? props.skipLabel ?? "Let's go"}/>
        )
    }

    return (
        <Onboarding
            onDone={() => navigation.replace('Login')}
            onSkip={() => navigation.replace('Login')}
            titleStyles={{ ...FONTS.h2 }}
            bottomBarColor={COLORS.white}
            controlStatusBar={false}
            DoneButtonComponent={Skip}
            NextButtonComponent={Skip}
            SkipButtonComponent={Skip}
            pages={[
                {
                    backgroundColor: COLORS.white,
                    image: <Image source={images.OnBoarding01} style={styles.imageStyle} resizeMode='center' />,
                    title: 'Put Yourself Out There',
                    subtitle: '',
                },
                {
                    backgroundColor: COLORS.white,
                    image: <Image source={images.OnBoarding02} style={styles.imageStyle} resizeMode='center' />,
                    title: 'Customise Your Profile',
                    subtitle: '',
                },
                {
                    backgroundColor: COLORS.white,
                    image: <Image source={images.OnBoarding03} style={styles.imageStyle} resizeMode='center' />,
                    title: 'Connect With Your Friends',
                    subtitle: '',
                },
            ]}
        />
    )
}

const styles = StyleSheet.create({
    imageStyle: {
        width: 300,
        height: 300
    }
})

export default OnBoardingScreen