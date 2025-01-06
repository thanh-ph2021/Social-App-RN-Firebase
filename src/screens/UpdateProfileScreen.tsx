import { useState, useRef, useMemo, useEffect } from 'react'
import { Image, Text, View, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, Platform, Modal, ActivityIndicator, BackHandler } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import Feather from 'react-native-vector-icons/Feather'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import ImagePicker from 'react-native-image-crop-picker'
import storage from '@react-native-firebase/storage'
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import LinearGradient from 'react-native-linear-gradient'

import { UserModel } from '../models'
import { COLORS, SIZES, images, FONTS } from '../constants'
import FormButton from '../components/FormButton'
import FormInput from '../components/FormInput'
import { fetchUser, updateUser } from '../redux/actions/user'
import { useAppDispatch, useAppSelector } from '../hooks'
import { AlertV1, Header, TextComponent } from '../components'
import { utilStyles } from '../styles'
import { UtilIcons } from '../utils/icons'
import { showNotification } from '../utils'

const UpdateProfileScreen = ({ navigation }: NativeStackScreenProps<any>) => {

    const [showAlert, setShowAlert] = useState(false)
    const dispatch = useAppDispatch()
    const [avatar, setAvatar] = useState<any>(null)
    const [banner, setBanner] = useState<any>(null)
    const [upLoading, setUpLoading] = useState<any>(false)
    const bottomSheetRef = useRef<BottomSheet>(null)
    const user = useAppSelector(state => state.userState.currentUser)
    const [userData, setUserData] = useState<UserModel>(user)
    const [typeImage, setTypeImage] = useState<'avatar' | 'banner'>('avatar')

    const onBack = () => {
        if (hasUnsavedChanges()) {
            setShowAlert(true)
        } else {
            navigation.goBack()
        }
        return true
    }

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            onBack,
        )

        return () => backHandler.remove()
    }, [onBack])

    const snapPoints = useMemo(() => ['25%', '50%'], [])

    const handleClosePress = () => {
        if (bottomSheetRef.current) {
            bottomSheetRef.current.close()
        }
    }

    const handleOpenBottomSheet = () => {
        if (bottomSheetRef.current) {
            bottomSheetRef.current.snapToIndex(1)
        }
    }

    const handleUpdate = async () => {

        try {
            setUpLoading(true)

            let avatarUrl = await uploadImage(avatar)
            let bannerUrl = await uploadImage(banner)

            const newUserCurrent = {
                ...userData,
                fname: userData.fname,
                lname: userData.lname,
                about: userData.about,
                phone: userData.phone,
                country: userData.country,
                city: userData.city,
                userImg: avatarUrl ?? userData.userImg,
                bannerImg: bannerUrl ?? userData.bannerImg ?? '',
            }

            await dispatch(updateUser(newUserCurrent))

            setUpLoading(false)

            navigation.goBack()

        } catch (error) {
            console.log("🚀 ~ handleUpdate ~ error:", error)
        } finally {
            setUpLoading(false)
        }
    }

    const uploadImage = async (urlImage: string) => {
        if (urlImage == null) {
            return null
        }

        const uploadUri = urlImage
        let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1)

        const storageRef = storage().ref(`photos/${filename}`)
        const task = storageRef.putFile(uploadUri)

        try {
            await task

            // url image in firebase
            const url = await storageRef.getDownloadURL()

            return url
        } catch (error) {
            console.log('Upload image to firebase error', error)
            return null
        }
    }

    const handleTakePhoto = () => {
        const width = typeImage === 'avatar' ? 300 : 1000
        const height = typeImage === 'avatar' ? 400 : 300

        ImagePicker.openCamera({
            width: width,
            height: height,
            cropping: true,
        }).then(image => {
            const imageUri = Platform.OS == 'ios' ? image.sourceURL : image.path
            typeImage === 'avatar' ? setAvatar(imageUri) : setBanner(imageUri)
        })
        handleClosePress()
    }

    const handleChoosePhoto = () => {
        const width = typeImage === 'avatar' ? 300 : 1000
        const height = typeImage === 'avatar' ? 400 : 300

        ImagePicker.openPicker({
            width: width,
            height: height,
            cropping: true
        }).then(image => {
            const imageUri = Platform.OS == 'ios' ? image.sourceURL : image.path
            typeImage === 'avatar' ? setAvatar(imageUri) : setBanner(imageUri)
        })
        handleClosePress()
    }

    const renderBottomSheet = () => {
        return (
            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={snapPoints}
                enablePanDownToClose
                backgroundStyle={{
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 3,
                    },
                    shadowOpacity: 0.29,
                    shadowRadius: 4.65,
                    elevation: 7,
                }}
                backdropComponent={props => (
                    <BottomSheetBackdrop
                        {...props}
                        appearsOnIndex={0}
                        disappearsOnIndex={-1}
                    />
                )}
            >
                <View style={{ flex: 1, margin: SIZES.base }}>
                    <Text style={{ ...FONTS.h2, alignSelf: 'center' }}>Upload Photo</Text>
                    <Text style={{ ...FONTS.body3, marginBottom: SIZES.base, alignSelf: 'center' }}>Choose Your Profile Picture</Text>
                    <FormButton buttonTitle={'Take Photo'} onPress={handleTakePhoto} />
                    <FormButton buttonTitle={'Choose From Library'} onPress={handleChoosePhoto} />
                    <TouchableOpacity style={{ marginTop: SIZES.base, alignSelf: 'center' }} onPress={handleClosePress}>
                        <Ionicons name='close-circle-outline' size={50} color={COLORS.darkGrey} />
                    </TouchableOpacity>
                </View>
            </BottomSheet>
        )
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

    const hasUnsavedChanges = () => (
        avatar !== null ||
        banner !== null ||
        user.fname !== userData.fname ||
        user.lname !== userData.lname ||
        user.about !== userData.about ||
        user.phone !== userData.phone ||
        user.city !== userData.city ||
        user.country !== userData.country
    )

    return (
        <SafeAreaView style={styles.container}>
            <Header
                title={'Update Profile'}
                leftComponent={
                    <TouchableOpacity style={utilStyles.btnHeaderLeft} onPress={onBack}>
                        <UtilIcons.svgArrowLeft color={COLORS.socialWhite} />
                    </TouchableOpacity>
                }
            />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View>
                    {banner || user.bannerImg ? <Image source={{ uri: banner ?? user.bannerImg }} resizeMode='cover' style={{ height: 160, width: '100%' }} /> :
                        <Image source={images.defaultImage} resizeMode='cover' style={{ height: 160, width: '100%' }} />
                    }
                    <TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} onPress={() => {
                        setTypeImage('avatar')
                        handleOpenBottomSheet()
                    }}>
                        <LinearGradient colors={[COLORS.gradient[0], COLORS.gradient[1]]} style={utilStyles.avatarStyle}>
                            {avatar || user.userImg ? <Image
                                source={{ uri: avatar ?? user.userImg }}
                                style={[utilStyles.image, { opacity: 0.5, backgroundColor: COLORS.socialWhite }]}
                                resizeMode='cover'
                            /> : (
                                <Image
                                    source={images.defaultImage}
                                    style={[utilStyles.image, { opacity: 0.5, backgroundColor: COLORS.socialWhite }]}
                                    resizeMode='cover'
                                />
                            )}
                        </LinearGradient>
                        <Feather name='camera' size={SIZES.icon} color={COLORS.socialWhite} style={{ position: 'absolute', top: 0 }} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            backgroundColor: COLORS.darkBlack,
                            width: 30,
                            height: 30,
                            top: 5,
                            right: 5,
                            borderRadius: 40,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderWidth: 1,
                            borderColor: COLORS.socialWhite
                        }}
                        onPress={() => {
                            setTypeImage('banner')
                            handleOpenBottomSheet()
                        }}
                    >
                        <MaterialIcons name='edit' size={SIZES.icon} color={COLORS.socialWhite} />
                    </TouchableOpacity>
                </View>

                <TextComponent style={styles.textTitle} text={`${userData.fname} ${userData.lname}`} />
                <TextComponent style={styles.text} text={`${userData.about}`} />

                <View>
                    <FormInput
                        title={'First Name'}
                        labelValue={userData?.fname ?? ''}
                        onChangeText={(text) => setUserData({ ...userData, fname: text })}
                        placeholderText={'Enter First name'}
                    />
                    <FormInput
                        title={'Last Name'}
                        labelValue={userData?.lname ?? ''}
                        onChangeText={(text) => setUserData({ ...userData, lname: text })}
                        placeholderText={'Enter Last name'}
                    />
                    <FormInput
                        title={'About Me'}
                        labelValue={userData?.about ?? ''}
                        onChangeText={(text) => setUserData({ ...userData, about: text })}
                        placeholderText={'Enter About Me'}
                        numberOfLines={5}
                        multiline
                    />
                    <FormInput
                        title={'Phone Number'}
                        labelValue={userData?.phone ?? ''}
                        onChangeText={(text) => setUserData({ ...userData, phone: text })}
                        placeholderText={'Enter Phone'}
                    />
                    <FormInput
                        title={'City'}
                        labelValue={userData?.city ?? ''}
                        onChangeText={(text) => setUserData({ ...userData, city: text })}
                        placeholderText={'Enter City'}
                    />
                    <FormInput
                        title={'Country'}
                        labelValue={userData?.country ?? ''}
                        onChangeText={(text) => setUserData({ ...userData, country: text })}
                        placeholderText={'Enter Country'}
                    />
                </View>

                <FormButton buttonTitle={'Update'} onPress={handleUpdate} />

            </ScrollView>
            <AlertV1
                title='Your profile is not updated. Leave anyway?'
                description=''
                visible={showAlert}
                onClose={() => setShowAlert(false)}
                onConfirm={() => navigation.goBack()}
                textButtonClose='Stay'
                textButtonConfirm='Leave'
            />
            {renderBottomSheet()}
            {renderModal()}
        </SafeAreaView>

    )
}

export default UpdateProfileScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.darkBlack
    },

    image: {
        width: SIZES.width * 0.3,
        height: SIZES.width * 0.3,
        borderRadius: SIZES.width / 0.3,
        alignSelf: 'center',
        opacity: 0.5
    },

    textTitle: {
        ...FONTS.h2,
        textAlign: 'center',
        paddingTop: SIZES.base
    },

    text: {
        ...FONTS.body3,
        textAlign: 'center',
    },
})