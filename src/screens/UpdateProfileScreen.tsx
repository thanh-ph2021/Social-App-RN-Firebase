import { useEffect, useState, useRef, useMemo } from 'react'
import { Image, Text, View, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { COLORS, SIZES, images, FONTS } from '../constants'
import FormButton from '../components/FormButton'
import FormInput from '../components/FormInput'
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import firestore from '@react-native-firebase/firestore'
import useAuthContext from '../hooks/useAuthContext'
import ImagePicker from 'react-native-image-crop-picker'
import storage from '@react-native-firebase/storage'
import BottomSheet from '@gorhom/bottom-sheet'
import { UserModel } from '../Models'

const UpdateProfileScreen = ({ navigation }: NativeStackScreenProps<any>) => {

    const { user } = useAuthContext()
    const [userData, setUserData] = useState<UserModel>()
    const sheetRef = useRef<any>(null)
    const [image, setImage] = useState<any>(null)
    const [upLoading, setUpLoading] = useState<any>()
    const [transferred, setTransferred] = useState<any>()
    const bottomSheetRef = useRef<BottomSheet>(null)

    const snapPoints = useMemo(() => ['25%', '50%'], []);

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

    const getUser = async () => {
        const currentUser = await firestore()
            .collection('users')
            .doc(user!.uid)
            .get()
            .then((documentSnapshot) => {
                if (documentSnapshot.exists) {
                    setUserData(documentSnapshot.data())
                }
            })
    }

    useEffect(() => {
        getUser()
    }, [])

    const handleUpdate = async () => {
        if (userData && user) {
            let imageUrl = await uploadImage()

            if (imageUrl == null && userData?.userImg) {
                imageUrl = userData.userImg
            }

            firestore()
                .collection('users')
                .doc(user.uid)
                .update({
                    fname: userData.fname,
                    lname: userData.lname,
                    about: userData.about,
                    phone: userData.phone,
                    country: userData.country,
                    city: userData.city,
                    userImg: imageUrl
                })
                .then(() => {
                    console.log('User Updated!')
                    Alert.alert(
                        'Profile Updated!',
                        'Your profile has been updated successfully.'
                    )
                })
        }
    }

    const uploadImage = async () => {
        if (image == null) {
            return null
        }

        const uploadUri = image
        let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1)

        const storageRef = storage().ref(`photos/${filename}`)
        const task = storageRef.putFile(uploadUri)

        // tiến trình đăng ảnh
        task.on('state_changed', taskSnapshot => {
            setTransferred(Math.floor(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes * 100))
        });

        try {
            setUpLoading(true)
            await task

            // url image in firebase
            const url = await storageRef.getDownloadURL()

            setUpLoading(false)
            return url;
        } catch (error) {
            console.log('Upload image to firebase error', error)
            return null
        }
    }

    const handleTakePhoto = () => {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true,
        }).then(image => {
            const imageUri = Platform.OS == 'ios' ? image.sourceURL : image.path
            setImage(imageUri)
        });
        handleClosePress()
    }

    const handleChoosePhoto = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true
        }).then(image => {
            const imageUri = Platform.OS == 'ios' ? image.sourceURL : image.path
            setImage(imageUri)
        });
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
            >
                <View style={{ flex: 1, margin: SIZES.base }}>
                    <Text style={{ ...FONTS.h2, alignSelf: 'center' }}>Upload Photo</Text>
                    <Text style={{ ...FONTS.body3, marginBottom: SIZES.base, alignSelf: 'center' }}>Choose Your Profile Picture</Text>
                    <FormButton buttonTitle={'Take Photo'} onPress={handleTakePhoto} />
                    <FormButton buttonTitle={'Choose From Library'} onPress={handleChoosePhoto} />
                    <TouchableOpacity style={{ marginTop: SIZES.base, alignSelf: 'center' }} onPress={handleClosePress}>
                        <Ionicons name='close-circle-outline' size={50} color={COLORS.gray} />
                    </TouchableOpacity>
                </View>
            </BottomSheet>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} style={{ margin: SIZES.base }}>
                <TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} onPress={handleOpenBottomSheet}>
                    {image || userData?.userImg ? <Image source={{ uri: image ?? userData?.userImg }} style={styles.image} resizeMode='cover' /> : (
                        <Image source={images.defaultImage} style={styles.image} resizeMode='cover' />
                    )}
                    <Feather name='camera' size={SIZES.icon} color={COLORS.gray} style={{ position: 'absolute' }} />
                </TouchableOpacity>
                <Text style={styles.textTitle}>
                    {userData?.fname} {userData?.lname}
                </Text>

                <Text style={styles.text}>
                    {userData?.about}
                </Text>

                <View>
                    <FormInput
                        labelValue={userData?.fname ?? ''}
                        onChangeText={(text) => setUserData({ ...userData, fname: text })}
                        placeholderText={'First name'}
                        iconType={'user'}
                        containerStyle={styles.inputContainer}
                        inputStyle={styles.input}
                    />
                    <FormInput
                        labelValue={userData?.lname ?? ''}
                        onChangeText={(text) => setUserData({ ...userData, lname: text })}
                        placeholderText={'Last name'}
                        iconType={'user'}
                        containerStyle={styles.inputContainer}
                        inputStyle={styles.input}
                    />
                    <FormInput
                        labelValue={userData?.about ?? ''}
                        onChangeText={(text) => setUserData({ ...userData, about: text })}
                        placeholderText={'About me'}
                        iconType={'file-text'}
                        containerStyle={styles.inputContainer}
                        inputStyle={styles.input}
                    />
                    <FormInput labelValue={userData?.phone ?? ''}
                        onChangeText={(text) => setUserData({ ...userData, phone: text })}
                        placeholderText={'Phone'}
                        iconType={'phone'}
                        containerStyle={styles.inputContainer}
                        inputStyle={styles.input}
                    />
                    <FormInput labelValue={userData?.country ?? ''}
                        onChangeText={(text) => setUserData({ ...userData, country: text })}
                        placeholderText={'Country'}
                        iconType={'globe'}
                        containerStyle={styles.inputContainer}
                        inputStyle={styles.input}
                    />
                    <FormInput labelValue={userData?.city ?? ''}
                        onChangeText={(text) => setUserData({ ...userData, city: text })}
                        placeholderText={'City'}
                        iconType={'map'} containerStyle={styles.inputContainer}
                        inputStyle={styles.input}
                    />
                </View>

                <FormButton buttonTitle={'Update'} onPress={handleUpdate} />

            </ScrollView>
            {renderBottomSheet()}
        </SafeAreaView>

    )
}

export default UpdateProfileScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        color: COLORS.black,
        paddingTop: SIZES.base
    },

    text: {
        ...FONTS.body3,
        textAlign: 'center',
        color: COLORS.black,
    },

    inputContainer: {
        borderWidth: 0,
        borderBottomWidth: 1,
    },
    input: {
        borderLeftWidth: 0,
        padding: 0,
    }
})