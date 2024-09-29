import { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import {
    View, TextInput, TouchableOpacity, Text, Platform, Image, StyleSheet, ScrollView,
    KeyboardAvoidingView, SafeAreaView, PermissionsAndroid,
    ActivityIndicator, Modal
} from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import ImagePicker from 'react-native-image-crop-picker'
import Geolocation, { GeolocationResponse } from '@react-native-community/geolocation'
import BottomSheet from '@gorhom/bottom-sheet'
import storage from '@react-native-firebase/storage'
import firestore from '@react-native-firebase/firestore'
import LinearGradient from 'react-native-linear-gradient'
import { GiphyDialog, GiphyMedia } from '@giphy/react-native-sdk'
import DocumentPicker from 'react-native-document-picker'

import { FONTS, SIZES, COLORS, images } from '../constants'
import { AlertV1, Avatar, ChecklistComponent, Header, Icon, MediaGrid, SvgIcon, TextComponent, TypeIcons } from '../components'
import { ChecklistModel, MediaItem, TimeLimitModel } from '../models'
import useAuthContext from '../hooks/useAuthContext'
import { showNotification, useLatest } from '../utils'
import { UtilIcons } from '../utils/icons'
import { GoongAPI } from '../apis'
import DocumentGrid from '../components/DocumentGrid'
import { DocumentItem } from '../models/DocumentItem'
import { useAppDispatch } from '../hooks'
import { addPost } from '../redux/actions'


enum IconName {
    image = 'Image',
    camera = 'Camera',
    attachment = 'Attachment',
    gif = 'GIF',
    location = 'Location',
    checkList = 'Checklist'
}

const buttonArray = [
    { name: IconName.image },
    { name: IconName.gif },
    { name: IconName.camera },
    { name: IconName.attachment },
    { name: IconName.location },
    { name: IconName.checkList }
]

const optionsChooseCamera = [
    {
        title: 'Shoot a video',
        type: 'video',
        icon: {
            name: 'videocam-outline',
            typeIcon: TypeIcons.Ionicons
        }
    },
    {
        title: 'Take a photo',
        type: 'photo',
        icon: {
            name: 'image-outline',
            typeIcon: TypeIcons.Ionicons
        }
    },
]

const optionsChooseScope = [
    {
        title: 'Public',
        type: 'public',
        icon: {
            name: 'public',
            typeIcon: TypeIcons.MaterialIcons
        }
    },
    {
        title: 'Private',
        type: 'private',
        icon: {
            name: 'lock',
            typeIcon: TypeIcons.MaterialIcons
        }
    },
]

const initChecklistData = {
    optionDatas: [
        { id: Date.now().toString(), title: '', voteNumbers: 0, voteUsers: [] },
        { id: Date.now().toString() + 'id', title: '', voteNumbers: 0, voteUsers: [] },
    ],
    timeLimit: { day: '0', hour: '0', minute: '0' }
}

const AddPostScreen = ({ navigation }: NativeStackScreenProps<any>) => {

    const [text, setText] = useState('')
    const inputRef = useRef<any>()
    const dispatch = useAppDispatch()

    const bottomSheetRef = useRef<BottomSheet>(null)
    const [typeSheet, setTypeSheet] = useState<'scope' | 'camera' | 'location' | undefined>()
    const snapPoints = useMemo(() => ['25%', '35%', '80%'], [])
    const [scope, setScope] = useState<'public' | 'private'>('public')
    const [address, setAddress] = useState<string[]>()
    const [showChecklist, setShowChecklist] = useState<boolean>(false)
    const [checkListData, setCheckListData] = useState<ChecklistModel | null>(null)
    const [placeholder, setPlaceholder] = useState<string>(`What's on your mind?`)
    const [showAlert, setShowAlert] = useState<boolean>(false)

    const { user } = useAuthContext()
    const [arrayMedia, setArrayMedia] = useState<MediaItem[]>([])
    const [arrayDocs, setArrayDocs] = useState<DocumentItem[]>([])
    const [giphyMedias, setGiphyMedias] = useState<GiphyMedia[]>([])
    const [locationLoading, setLocationLoading] = useState<boolean>(false)
    const [upLoading, setUpLoading] = useState<any>(false)
    const [location, setLocation] = useState<string>()
    const [showButton, setShowButton] = useState<boolean>(false)

    const addMedia = (media: GiphyMedia) => {
        // convert variable undefined to null
        let mediaString = JSON.stringify(media, (k, v) => v === undefined ? null : v)
        let newMedia = JSON.parse(mediaString)
        setGiphyMedias([newMedia, ...giphyMedias])
    }
    const addMediaRef = useLatest(addMedia)

    // 1 - Post; 2 - Story
    const [typeCreate, setTypeCreate] = useState<number>(1)

    useEffect(() => {
        inputRef.current.focus()
    }, [])


    useEffect(() => {
        const listener = GiphyDialog.addListener('onMediaSelect', (e) => {
            addMediaRef.current(e.media)
            GiphyDialog.hide()
        })
        return () => {
            listener.remove()
        }
    }, [addMediaRef])

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
            const medias = arrayMedia.map(item => uploadMedia('photos', item))
            const mediaDatas = await Promise.all(medias)

            const docs = arrayDocs.map(item => uploadMedia('documents', undefined, item))
            const docDatas = await Promise.all(docs)


            const data = {
                userID: user!.uid!,
                post: text,
                media: mediaDatas.length > 0 ? mediaDatas : [],
                docs: docDatas.length > 0 ? docDatas : [],
                giphyMedias: giphyMedias.length > 0 ? giphyMedias : [],
                checklistData: checkListData,
                location: location ? location : null,
                scope: scope,
                postTime: firestore.Timestamp.fromDate(new Date()),
                likes: [],
                comments: [],
                commentCount: 0
            }


            await dispatch(addPost(data))

            setUpLoading(false)
            setArrayMedia([])
            setGiphyMedias([])
            setArrayDocs([])
            setText('')
            setShowChecklist(false)
            setCheckListData(null)
            showNotification('Your post was sent.', UtilIcons.success)

        } catch (error) {
            console.log("🚀 ~ submitPost ~ error:", error)
            setUpLoading(false)
        }
    }

    const uploadMedia = async (nameFolder: string, media?: MediaItem, doc?: DocumentItem) => {
        try {
            if (media) {
                const url = media.uri

                let filename = url.substring(url.lastIndexOf('/') + 1)
                const storageRef = storage().ref(`${nameFolder}/${filename}`)

                await storageRef.putFile(url)

                // url image in firebase
                const urlFile = await storageRef.getDownloadURL()
                return {
                    type: media.type,
                    uri: urlFile
                }
            } else if (doc) { // doc
                const storageRef = storage().ref(`${nameFolder}/${doc.name}`)
                await storageRef.putFile(doc.url!)

                const urlFile = await storageRef.getDownloadURL()
                return {
                    ...doc,
                    url: urlFile
                }
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
        })
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
            const mediaUri: MediaItem[] = mediasClone.map((media) => {
                const uri = Platform.OS == 'ios' ? media.sourceURL : media.path
                return {
                    uri: uri ?? '',
                    type: media.mime.includes('video') ? 'video' : 'image',
                }
            })
            setArrayMedia([...arrayMedia, ...mediaUri])
        })
    }
    const delMedia = (uri: string) => {
        const newArrayImage = arrayMedia.filter((item) => item.uri != uri)

        setArrayMedia(newArrayImage)
    }
    const delDocument = useCallback((name: string) => {
        const newArrayDocs = arrayDocs.filter((item) => item.name != name)

        setArrayDocs(newArrayDocs)
    }, [])

    const delGiphyMedia = (id: string) => {
        const newArrayImage = giphyMedias.filter((item) => item.id != id)

        setGiphyMedias(newArrayImage)
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
            case IconName.gif:
                GiphyDialog.show()
                break
            case IconName.attachment:
                pickDocument()
                break
            case IconName.checkList:
                setCheckListData(initChecklistData)
                setShowChecklist(!showChecklist)
                setPlaceholder('What do you want to survey?')
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
                )
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    getCurrentLocation();
                } else {
                    console.log('Location permission denied')
                }
            } else {
                getCurrentLocation()
            }
        } catch (err) {
            console.warn(err)
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
            const response: any = await GoongAPI.ReverseGeocoding(`${latitude},${longitude}`);
            // const countryComponent = response.results.filter(item => item.types.includes('locality')).map((component) => {
            setAddress(response.results.map((item: any) => item.formatted_address))

            handleOpenBottomSheet('location')

            //     return component.formatted_address
            // })

            // if (countryComponent && countryComponent.length > 0) {
            //     setLocation(countryComponent[0]);
            // } else {
            //     setLocation(undefined);
            // }
        } catch (error) {
            console.error('Error fetching reverse geocoding:', error);
        }
    }
    const renderLocation = () => {
        if (!location) {
            return <></>
        }

        return (
            <View style={{ flexDirection: 'row', paddingTop: SIZES.base, alignItems: 'center' }}>
                <Icon type={TypeIcons.Ionicons} name='location-sharp' size={SIZES.icon} color={COLORS.socialBlue} />
                <TextComponent style={{ color: COLORS.socialBlue, flex: 1, paddingHorizontal: SIZES.base }} text={location} />
                <TouchableOpacity style={{ marginLeft: SIZES.padding }} onPress={() => setLocation('')}>
                    <Icon type={TypeIcons.Feather} name='x' size={SIZES.icon} color={COLORS.lightGrey} />
                </TouchableOpacity>
            </View>
        )
    }
    // Location - end

    // BottomSheet - begin
    const handleOpenBottomSheet = (type: 'camera' | 'scope' | 'location') => {
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
                    backgroundColor: COLORS.darkGrey
                }}
            >
                <ScrollView style={{ flex: 1 }}>
                    {typeSheet == 'camera' ? (
                        <>
                            <TextComponent style={{ ...FONTS.h2, paddingBottom: SIZES.padding, paddingLeft: SIZES.base }} text='Open camera' />
                            {optionsChooseCamera.map((item: any) => (
                                <TouchableOpacity
                                    style={{ flexDirection: 'row', alignItems: 'center', padding: SIZES.padding }}
                                    onPress={() => handleTakePhoto(item.type)}
                                    key={item.title}
                                >
                                    <Icon type={item.icon.typeIcon} name={item.icon.name} size={SIZES.icon} color={COLORS.socialWhite} />
                                    <TextComponent style={{ ...FONTS.body3, paddingLeft: SIZES.padding * 2 }} text={item.title} />
                                </TouchableOpacity>
                            ))}
                        </>
                    ) : typeSheet == 'scope' ? (
                        <>
                            <TextComponent style={{ ...FONTS.h2, paddingBottom: SIZES.padding, paddingLeft: SIZES.base }} text='Choose scope' />
                            {optionsChooseScope.map((item: any) => (
                                <TouchableOpacity
                                    style={{ flexDirection: 'row', alignItems: 'center', padding: SIZES.padding }}
                                    onPress={() => handleSetScope(item.type)}
                                    key={item.title}
                                >
                                    <Icon type={item.icon.typeIcon} name={item.icon.name} size={SIZES.icon} color={COLORS.socialWhite} />
                                    <TextComponent style={{ ...FONTS.body3, paddingLeft: SIZES.padding * 2 }} text={item.title} />
                                </TouchableOpacity>
                            ))}
                        </>
                    ) : (
                        <>
                            <TextComponent style={{ ...FONTS.h2, paddingBottom: SIZES.padding, paddingLeft: SIZES.base }} text='Choose location' />
                            {address ? address.map((item: string, index: number) => (
                                <TouchableOpacity
                                    key={index.toString()}
                                    style={{ flexDirection: 'row', alignItems: 'center', padding: SIZES.padding }}
                                    onPress={() => {
                                        setLocation(item)
                                        handleCloseBottomSheet()
                                    }}
                                >
                                    <Icon type={TypeIcons.Ionicons} name={"location"} color={COLORS.socialWhite} size={SIZES.icon} />
                                    <TextComponent style={{ ...FONTS.body3, paddingHorizontal: SIZES.padding * 2 }} text={item} />
                                </TouchableOpacity>
                            )) : <TextComponent text='not found' />}
                        </>
                    )}
                    < View style={{ height: 200 }} />
                </ScrollView>
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

    const pickDocument = async () => {
        try {
            await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf, DocumentPicker.types.docx, DocumentPicker.types.doc],
                copyTo: 'cachesDirectory'
            }).then(async doc => {
                const data = doc[0]
                const url = decodeURIComponent(data.fileCopyUri!)

                if (url) {
                    setArrayDocs([...arrayDocs, { name: data.name, type: data.type, url: url.toString(), size: data.size ? data.size : 0 }])
                }

            })
        } catch (error) {
            console.log("🚀 ~ pickDocument ~ error:", error)
        }


    }

    const addOption = () => {
        if (checkListData?.optionDatas.length == 4) {
            return
        }

        setCheckListData(pre => {
            if (pre) {
                return {
                    optionDatas: [...pre.optionDatas, { id: Date.now().toString(), title: '', voteNumbers: 0, voteUsers: [] }],
                    timeLimit: pre.timeLimit,
                }
            }
            return null

        })
    }

    const setValueOption = (id: string, value: string) => {
        setCheckListData(pre => {
            if (pre) {
                return {
                    timeLimit: pre.timeLimit,
                    optionDatas: pre.optionDatas.map((option) => {
                        if (option.id === id) {
                            return { ...option, id: id, title: value, voteNumbers: 0, voteUsers: [] }
                        }

                        return option
                    })
                }
            }
            return null
        })
    }

    const setTimeLimit = (value: TimeLimitModel) => {
        setCheckListData(pre => {
            if (pre) {
                return {
                    timeLimit: value,
                    optionDatas: [...pre.optionDatas]
                }
            }

            return null
        })
    }

    const removeChecklistData = () => {
        setShowChecklist(false)
        setCheckListData(initChecklistData)
        setShowAlert(false)
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
                        onPress={submitPost}>
                        <TextComponent text='Publish' color={COLORS.socialWhite} style={{ fontWeight: 'bold' }} />
                    </TouchableOpacity>
                }
            />

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
                        placeholder={placeholder}
                        placeholderTextColor={COLORS.lightGrey}
                        style={{ ...FONTS.body3, color: COLORS.socialWhite }}
                    />
                </View>

                {arrayMedia.length > 0 || giphyMedias.length > 0 ? <MediaGrid
                    mediaArray={arrayMedia}
                    giphyMedias={giphyMedias}
                    delMedia={delMedia}
                    delGiphyMedia={delGiphyMedia}
                /> : <></>}

                {arrayDocs.length > 0 ? <DocumentGrid
                    documentArray={arrayDocs}
                    delDocument={delDocument}
                /> : <></>}

                {showChecklist ? <ChecklistComponent
                    data={checkListData!}
                    addOption={addOption}
                    setValueOption={setValueOption}
                    setTimeLimit={setTimeLimit}
                    invisible={() => {
                        setShowAlert(true)

                    }} /> : <></>
                }

                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: SIZES.padding }}>
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
                        {buttonArray.map(button => {
                            if (button.name == IconName.location && locationLoading) {
                                return <ActivityIndicator key={button.name} color={COLORS.socialBlue} />
                            }
                            // have data of button gif
                            if ((button.name == IconName.image || button.name == IconName.camera || button.name == IconName.attachment || button.name == IconName.checkList) && giphyMedias.length > 0) {
                                return <View key={button.name} />
                            }
                            // have data of button photo/video
                            if ((button.name == IconName.gif || button.name == IconName.attachment || button.name == IconName.checkList) && arrayMedia.length > 0) {
                                return <View key={button.name} />
                            }
                            return (
                                <TouchableOpacity key={button.name} onPress={() => onPressButton(button.name)}>
                                    <SvgIcon name={button.name} color={COLORS.socialWhite} size={24} />
                                </TouchableOpacity>
                            )
                        })}
                    </View>}
                </View>
            </ScrollView>

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
                </View>
            </View>
            <AlertV1
                title='Sure you want to remove?'
                description='All checklist data will disappear'
                visible={showAlert}
                onClose={() => setShowAlert(false)}
                onConfirm={removeChecklistData}
            />
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