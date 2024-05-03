import { useEffect, useState, useRef, useMemo } from 'react'
import {
    View, TextInput, TouchableOpacity, Text, Platform, Image, StyleSheet, ScrollView, 
    KeyboardAvoidingView, SafeAreaView, PermissionsAndroid,
    ActivityIndicator, Modal
} from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import ImagePicker from 'react-native-image-crop-picker'
import { Notifier } from 'react-native-notifier'
import Geolocation, { GeolocationResponse } from '@react-native-community/geolocation'
import Geocoder from 'react-native-geocoding'
import BottomSheet from '@gorhom/bottom-sheet'
import storage from '@react-native-firebase/storage'
import firestore from '@react-native-firebase/firestore'
import LinearGradient from 'react-native-linear-gradient'

import { FONTS, SIZES, COLORS, images } from '../constants'
import { Avatar, Divider, Header, Icon, MediaGrid, TextComponent, TypeIcons } from '../components'
import { MediaItem } from '../models'
import useAuthContext from '../hooks/useAuthContext'
import { showNotification } from '../utils'
import { UtilIcons } from '../utils/icons'

enum IconName {
    image = 'images-outline',
    camera = 'camera-outline',
    location = 'location-outline',
    checkList = 'checklist'
}

const buttonArray = [
    { name: IconName.image, type: TypeIcons.Ionicons, color: COLORS.blue },
    { name: IconName.camera, type: TypeIcons.Ionicons, color: COLORS.blue },
    { name: IconName.location, type: TypeIcons.Ionicons, color: COLORS.blue },
    { name: IconName.checkList, type: TypeIcons.MaterialIcons, color: COLORS.blue }
]

const AddPostScreen = ({ navigation }: NativeStackScreenProps<any>) => {

    const [text, setText] = useState('')
    const inputRef = useRef<any>()

    const bottomSheetRef = useRef<BottomSheet>(null)
    const [typeSheet, setTypeSheet] = useState<'scope' | 'camera' | undefined>()
    const snapPoints = useMemo(() => ['25%', '35%', '50%'], [])
    const [scope, setScope] = useState<'public' | 'private'>('public')

    const { user } = useAuthContext()
    const [arrayMedia, setArrayMedia] = useState<MediaItem[]>([])
    const [locationLoading, setLocationLoading] = useState<boolean>(false)
    const [upLoading, setUpLoading] = useState<any>(false)
    const [location, setLocation] = useState<string>()
    const [showButton, setShowButton] = useState<boolean>(false)

    // 1 - Post; 2 - Story
    const [typeCreate, setTypeCreate] = useState<number>(1)


    useEffect(() => {
        Geocoder.init('AIzaSyD292f-2xl69YSixyX1kZL1Me8QOTFt_tk')
        inputRef.current.focus()
    }, [])

    // useEffect(() => {
    //     navigation.setOptions({
    //         headerRight: () => {
    //             const check = arrayMedia && arrayMedia.length > 0 || text
    //             return (
    //                 <TouchableOpacity onPress={submitPost} style={[styles.buttonPost, { backgroundColor: check ? COLORS.blue : COLORS.lightGrey }]} disabled={check ? false : true}>
    //                     <Text style={{ ...FONTS.body3, color: COLORS.white, fontWeight: 'bold' }}>Post</Text>
    //                 </TouchableOpacity>
    //             )
    //         }
    //     })
    // }, [arrayMedia, text])

    // Handle Post - begin
    const submitPost = async () => {
        try {
            setUpLoading(true)
            const task = arrayMedia.map(item => uploadMedia(item))
            const urls = await Promise.all(task)

            await firestore()
                .collection('Posts')
                .add({
                    userID: user!.uid,
                    post: text,
                    media: urls.length > 0 ? urls : null,
                    location: location ? location : null,
                    scope: scope,
                    postTime: firestore.Timestamp.fromDate(new Date()),
                    likes: null,
                    comments: null
                })
                .then(() => {
                    setUpLoading(false)
                    setArrayMedia([])
                    setText('')
                    showNotification('Your post was sent.', UtilIcons.success)
                })
                .catch((error) => {
                    console.log('Something went wrong with added post to firestore.', error)
                })

        } catch (error) {
            console.log("🚀 ~ file: AddPostScreen.tsx:102 ~ submitPost ~ error:", error)
        }
    }
    const uploadMedia = async (media: MediaItem) => {
        try {
            const url = media.uri

            let filename = url.substring(url.lastIndexOf('/') + 1)
            const storageRef = storage().ref(`photos/${filename}`)
            await storageRef.putFile(url)

            // url image in firebase
            const urlFile = await storageRef.getDownloadURL()

            return {
                type: media.type,
                uri: urlFile
            }
        } catch (error) {
            console.log('Upload media to firebase error', error)
        }
    }
    // Handle Post - end

    const handleTakePhoto = (mediaType: 'video' | 'photo' | 'any' | undefined) => {
        ImagePicker.openCamera({
            width: 1200,
            height: 780,
            mediaType: mediaType
        }).then(image => {
            if (image.mime.includes('video')) {
                const imageUri: string | undefined = Platform.OS == 'ios' ? image.sourceURL : image.path
                setArrayMedia([...arrayMedia, { uri: imageUri ?? '', type: 'video' }])
            } else {
                //  mediaType: image
                const imageUri: string | undefined = Platform.OS == 'ios' ? image.sourceURL : image.path
                setArrayMedia([...arrayMedia, { uri: imageUri ?? '', type: 'image' }])
            }
        });
        handleCloseBottomSheet()
    }
    const handleChoosePhoto = () => {
        ImagePicker.openPicker({
            width: 1200,
            height: 780,
            multiple: true,
            mediaType: 'any'
        }).then(medias => {
            const mediasClone = [...medias]
            const mediaUri: MediaItem[] = mediasClone.map((medias) => {
                const mediaUri = Platform.OS == 'ios' ? medias.sourceURL : medias.path
                return {
                    uri: mediaUri ?? '',
                    type: medias.mime.includes('video') ? 'video' : 'image'
                }
            })
            setArrayMedia([...arrayMedia, ...mediaUri])
        });
    }
    const delMedia = (uri: string) => {
        const newArrayImage = arrayMedia.filter((item) => item.uri != uri)

        setArrayMedia(newArrayImage)
    }

    // Handle Press Bottom button
    const onPressButton = (iconName: string) => {
        switch (iconName) {
            case IconName.image:
                handleChoosePhoto()
                break
            case IconName.camera:
                handleOpenBottomSheet('camera')
                break
            case IconName.location:
                requestLocationPermission()
                break
            case IconName.checkList:
                Notifier.showNotification({
                    duration: 5000,
                    title: 'Coming soon!',
                    Component: (props) => {
                        return (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    backgroundColor: COLORS.white,
                                    padding: SIZES.base,
                                    margin: SIZES.base,
                                    borderRadius: SIZES.base,
                                    elevation: 5
                                }}
                            >
                                <Icon type={TypeIcons.MaterialIcons} name={'notifications-active'} color={COLORS.blue} size={SIZES.icon} />
                                <Text style={{ ...FONTS.body3, color: COLORS.black, paddingLeft: SIZES.padding }}>{props.title}</Text>
                            </View>
                        )
                    }
                })
                break
        }
    }

    // Location - begin
    const requestLocationPermission = async () => {
        try {
            setLocationLoading(true)
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Permission',
                        message: 'This app needs access to your location.',
                        buttonPositive: 'OK',
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    getCurrentLocation();
                } else {
                    console.log('Location permission denied');
                }
            } else {
                getCurrentLocation();
            }
        } catch (err) {
            console.warn(err);
        }
    }
    const getCurrentLocation = async () => {
        try {
            const position: GeolocationResponse = await new Promise((resolve, reject) => {
                Geolocation.getCurrentPosition(
                    resolve,
                    reject,
                    {
                        enableHighAccuracy: true,
                        timeout: 15000,
                        maximumAge: 10000
                    }
                )
            })
            const { latitude, longitude } = position.coords

            await getReverseGeocoding(latitude, longitude)
        } catch (error) {
            console.error('Error getting location:', error)
        } finally {
            setLocationLoading(false)
        }
    }
    const getReverseGeocoding = async (latitude: number, longitude: number) => {
        try {
            const response = await Geocoder.from(latitude, longitude);
            const countryComponent = response.results.filter(item => item.types.includes('locality')).map((component) => {
                return component.formatted_address
            })

            if (countryComponent && countryComponent.length > 0) {
                setLocation(countryComponent[0]);
            } else {
                setLocation(undefined);
            }
        } catch (error) {
            console.error('Error fetching reverse geocoding:', error);
        }
    }
    const renderLocation = () => {
        if (!location) {
            return <></>
        }

        return (
            <View style={{ flexDirection: 'row', paddingTop: SIZES.base, marginLeft: -3, alignItems: 'center' }}>
                <Icon type={TypeIcons.Ionicons} name='location-sharp' size={SIZES.icon} color={COLORS.lightGrey} />
                <Text style={{ ...FONTS.body4 }}>{location}</Text>
                <TouchableOpacity style={{ marginLeft: SIZES.padding }} onPress={() => setLocation('')}>
                    <Icon type={TypeIcons.Feather} name='x' size={SIZES.icon} color={COLORS.lightGrey} />
                </TouchableOpacity>
            </View>
        )
    }
    // Location - end

    // BottomSheet - begin
    const handleOpenBottomSheet = (type: 'camera' | 'scope') => {
        bottomSheetRef.current && bottomSheetRef.current.snapToIndex(1)
        setTypeSheet(type)
    }
    const handleCloseBottomSheet = () => {
        bottomSheetRef.current && bottomSheetRef.current.close()
    }
    const handleSetScope = (scope: 'public' | 'private') => {
        handleCloseBottomSheet()
        setScope(scope)
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
                <View style={{ flex: 1 }}>
                    {typeSheet == 'camera' ? (
                        <>
                            <Text style={{ ...FONTS.h2, color: COLORS.black, paddingBottom: SIZES.padding, paddingLeft: SIZES.base }}>Open camera</Text>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: SIZES.padding }} onPress={() => handleTakePhoto('video')}>
                                <Icon type={TypeIcons.Ionicons} name='videocam-outline' size={SIZES.icon} color={COLORS.black} />
                                <Text style={{ ...FONTS.body3, color: COLORS.black, paddingLeft: SIZES.padding * 2 }}>Shoot a video</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: SIZES.padding }} onPress={() => handleTakePhoto('photo')}>
                                <Icon type={TypeIcons.Ionicons} name='image-outline' size={SIZES.icon} color={COLORS.black} />
                                <Text style={{ ...FONTS.body3, color: COLORS.black, paddingLeft: SIZES.padding * 2 }}>Take a photo</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: SIZES.padding }} onPress={() => handleSetScope('public')}>
                                <Icon type={TypeIcons.MaterialIcons} name='public' size={SIZES.icon} color={COLORS.black} />
                                <Text style={{ ...FONTS.body3, color: COLORS.black, paddingLeft: SIZES.padding * 2 }}>Public</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: SIZES.padding }} onPress={() => handleSetScope('private')}>
                                <Icon type={TypeIcons.MaterialIcons} name='lock' size={SIZES.icon} color={COLORS.black} />
                                <Text style={{ ...FONTS.body3, color: COLORS.black, paddingLeft: SIZES.padding * 2 }}>Private</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </BottomSheet>
        )
    }
    // BottomSheet - end

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
        <SafeAreaView style={styles.container}>
            <Header
                title={'CREATE'}
                leftComponent={
                    <TouchableOpacity style={{ marginLeft: SIZES.padding }} onPress={() => navigation.goBack()}>
                        <TextComponent text='Discard' color={COLORS.socialBlue} style={{ fontWeight: 'bold' }} />
                    </TouchableOpacity>
                }
                rightComponent={
                    <TouchableOpacity
                        style={{ backgroundColor: COLORS.socialPink, borderRadius: 24, width: '100%', alignItems: 'center', marginRight: SIZES.padding, paddingVertical: 3 }}
                        onPress={() => navigation.goBack()}>
                        <TextComponent text='Publish' color={COLORS.socialWhite} style={{ fontWeight: 'bold' }} />
                    </TouchableOpacity>
                }
            />
            <KeyboardAvoidingView keyboardVerticalOffset={200} behavior='height' style={{ flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ paddingHorizontal: SIZES.padding }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {user?.userImg ? (
                                <Avatar source={{ uri: user?.userImg }} size='m' />
                            ) : (
                                <Image source={images.defaultImage} style={styles.avatar} />
                            )}
                            <View style={{ paddingHorizontal: SIZES.padding }}>
                                <TextComponent text={`${user?.fname} ${user?.lname}`} style={{ fontWeight: 'bold' }} />
                                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => handleOpenBottomSheet('scope')}>
                                    <TextComponent text={scope} color={COLORS.socialPink} />
                                    <Icon type={TypeIcons.MaterialIcons} name='arrow-drop-down' size={SIZES.icon} color={COLORS.socialPink} style={{ marginTop: -2 }} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {renderLocation()}

                        <TextInput
                            ref={inputRef}
                            multiline
                            value={text}
                            onChangeText={setText}
                            placeholder="What's on your mind?"
                            placeholderTextColor={COLORS.lightGrey}
                            style={{ ...FONTS.body3 }}
                        />
                    </View>

                    {arrayMedia.length > 0 ? <MediaGrid mediaArray={arrayMedia} delMedia={delMedia} /> : <></>}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity style={styles.btnHeaderLeft} onPress={() => setShowButton(!showButton)}>
                            {showButton ? <UtilIcons.svgClose color={COLORS.socialWhite} size={16} /> : <UtilIcons.svgPlus color={COLORS.socialWhite} size={16} />}
                        </TouchableOpacity>

                        {showButton && <View
                            style={{
                                flexDirection: 'row',
                                backgroundColor: COLORS.darkGrey,
                                borderRadius: 32,
                                paddingVertical: SIZES.base,
                                paddingHorizontal: SIZES.padding * 2,
                                marginLeft: SIZES.padding,
                                gap: SIZES.padding
                            }}
                        >
                            <TouchableOpacity><UtilIcons.svgImage color={COLORS.socialWhite} /></TouchableOpacity>
                            <TouchableOpacity><UtilIcons.svgGIF color={COLORS.socialWhite} /></TouchableOpacity>
                            <TouchableOpacity><UtilIcons.svgCamera color={COLORS.socialWhite} /></TouchableOpacity>
                            <TouchableOpacity><UtilIcons.svgAttachment color={COLORS.socialWhite} /></TouchableOpacity>
                        </View>}
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
            <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => setTypeCreate(1)}>
                        <LinearGradient
                            style={styles.buttonTypeCreate}
                            colors={typeCreate == 1 ? [COLORS.gradient[0], COLORS.gradient[1]] : ['transparent', 'transparent']}
                        >
                            <TextComponent text='POST' />
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setTypeCreate(2)}>
                        <LinearGradient
                            style={styles.buttonTypeCreate}
                            colors={typeCreate == 2 ? [COLORS.gradient[0], COLORS.gradient[1]] : ['transparent', 'transparent']}
                        >
                            <TextComponent text='STORY' />
                        </LinearGradient>
                    </TouchableOpacity>
                    {/* {buttonArray.map((item) => {
                        if (item.name == IconName.location && locationLoading) {
                            return <ActivityIndicator key={item.name} />
                        }
                        return (
                            <TouchableOpacity key={item.name} onPress={() => onPressButton(item.name)}>
                                <Icon type={item.type} name={item.name} color={item.color} size={SIZES.icon} />
                            </TouchableOpacity>
                        )
                    })} */}
                </View>
            </View>
            {renderBottomSheet()}
            {renderModal()}
        </SafeAreaView>

    )
}

export default AddPostScreen

const styles = StyleSheet.create({
    buttonPost: {
        backgroundColor: COLORS.blue,
        paddingVertical: SIZES.base,
        paddingHorizontal: SIZES.padding,
        borderRadius: SIZES.base
    },

    container: {
        flex: 1,
        backgroundColor: COLORS.darkBlack,
    },

    buttonContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        paddingVertical: SIZES.base,
        paddingHorizontal: SIZES.padding * 2,
        gap: SIZES.padding * 2,
        borderRadius: 32,
        borderWidth: 1,
        borderColor: COLORS.darkGrey,
        marginBottom: SIZES.base
    },

    buttonTypeCreate: {
        paddingHorizontal: SIZES.padding,
        borderRadius: 32,
        alignItems: 'center'
    },

    image: {
        width: '100%',
        height: 250
    },

    avatar: {
        width: 50,
        height: 50,
        borderRadius: 50
    },

    text: {
        color: COLORS.black,
        ...FONTS.body3
    },

    btnHeaderLeft: {
        width: 32,
        height: 32,
        borderRadius: 20,
        borderColor: COLORS.lightGrey,
        borderWidth: 1,
        marginHorizontal: SIZES.padding,
        alignItems: 'center',
        justifyContent: 'center'
    },
})