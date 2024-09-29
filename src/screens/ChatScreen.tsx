import { useMemo, useRef, useState } from 'react'
import { Image, StyleSheet, Switch, TouchableOpacity, TouchableWithoutFeedback, View, ActivityIndicator } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useCallback, useEffect } from 'react'
import { GiftedChat, Bubble, Composer, InputToolbar, Avatar, SystemMessage, Message } from 'react-native-gifted-chat'
import Ionicons from 'react-native-vector-icons/Ionicons'
import LinearGradient from 'react-native-linear-gradient'
import { useRoute } from '@react-navigation/native'
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker'
import DocumentPicker from 'react-native-document-picker'
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet'
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types'
import uuid from 'react-native-uuid'
import moment from 'moment'
import Video from 'react-native-video'

import { COLORS, FONTS, SIZES } from '../constants'
import { useAppDispatch, useAppSelector } from '../hooks'
import { MessageItemModel, UserModel } from '../models'
import { Avatar as CustomAvatar, Divider, Header, TextComponent } from '../components'
import { UtilIcons } from '../utils/icons'
import { fetchMessagesRealTime, sendMessage } from '../redux/actions/message'
import { selectChatByChatId, selectMessagesByChatId } from '../redux/selectors'
import { sendNotification } from '../redux/actions/notification'
import { pinConversation } from '../redux/actions/chat'
import { showNotification, uploadMedia } from '../utils'
import { DocumentItem } from '../models/DocumentItem'
import DocumentGrid from '../components/DocumentGrid'

const ChatScreen = ({ navigation }: NativeStackScreenProps<any>) => {

    const { params } = useRoute<any>()
    const receiveUser: UserModel = params.userData
    const currentUser = useAppSelector(state => state.userState.currentUser)
    const messages = useAppSelector(state => selectMessagesByChatId(state, params?.chatID))
    const dispatch = useAppDispatch()
    const inputRef = useRef<any>()
    const bottomSheetRef = useRef<BottomSheet>(null)
    const snapPoints = useMemo(() => ['50%'], [])
    const pinned = useAppSelector(state => selectChatByChatId(state, params?.chatID)).pinned || false
    const [medias, setMedias] = useState<ImageOrVideo[]>()
    const [docs, setDocs] = useState<DocumentItem[]>()
    const [loading, setLoading] = useState<boolean>()
    const [isCamera, setIsCamera] = useState<boolean>()
    const [text, setText] = useState('')

    useEffect(() => {
        const subscriber = dispatch(fetchMessagesRealTime(params?.chatID, receiveUser.userImg ?? ''))

        // Stop listening for updates when no longer required
        return () => subscriber
    }, [params?.chatID])


    const handleOpenBottomSheet = () => {
        bottomSheetRef.current && bottomSheetRef.current.snapToIndex(0)
    }

    const renderBackdrop = useCallback((props: JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps) => (
        <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
        />
    ), [])

    const renderBottomSheet = () => {

        const handlePinConversation = async () => {
            await dispatch(pinConversation(params.chatID, !pinned))
            if (!pinned) {
                showNotification(`Pinned ${receiveUser.fname} ${receiveUser.lname}`, UtilIcons.success, 'success')
            }
        }

        const renderContent = () => {
            return (
                <BottomSheetView>
                    <TextComponent text={'Options'} style={{ ...FONTS.h2, paddingLeft: SIZES.padding, paddingBottom: SIZES.padding }} />
                    <View style={{
                        paddingVertical: SIZES.padding,
                        paddingLeft: SIZES.padding,
                        borderTopWidth: 1,
                        borderTopColor: COLORS.lightGrey
                    }}>
                        <TouchableWithoutFeedback
                            style={styles.row}
                            onPress={handlePinConversation}
                        >
                            <View style={styles.row}>
                                <View>
                                    <TextComponent text={'Pin conversation'} color={COLORS.socialWhite} style={{ ...FONTS.body3 }} />
                                </View>
                                <Switch
                                    trackColor={{ false: COLORS.lightGrey, true: COLORS.socialPink2 }}
                                    thumbColor={pinned ? COLORS.socialPink : COLORS.lightGrey2}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={handlePinConversation}
                                    value={pinned}
                                />
                            </View>

                        </TouchableWithoutFeedback>
                    </View>
                </BottomSheetView>
            )
        }

        return (
            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={snapPoints}
                enablePanDownToClose
                backdropComponent={renderBackdrop}
                backgroundStyle={{
                    shadowColor: COLORS.darkBlack,
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
                {renderContent()}
            </BottomSheet>
        )
    }

    const onSend = useCallback(async (messages: MessageItemModel[] | any[] = []) => {
        const media = medias ? medias[0] : undefined
        const doc = docs ? docs[0] : undefined
        let image, video, document
        setLoading(true)

        if (media) {
            const resp: any = await uploadMedia('photos', media)
            switch (resp.type) {
                case 'image':
                    image = resp.url
                    break
                case 'video':
                    video = resp.url
                    break
            }
        }

        if (doc) {
            document = await uploadMedia('documents', undefined, doc)
        }

        const message: MessageItemModel = {
            ...messages[0],
            image: image ?? '',
            video: video ?? '',
            document: document ?? null
        }

        if (message.text || message.image || message.video || message.document) {
            setMedias([])
            setDocs([])
            setText('')
            dispatch(sendMessage(params?.chatID, message))
            sendNotification({
                body: messages[0].text,
                title: `${currentUser!.fname} ${currentUser!.lname}`,
                data: {
                    id: currentUser!.uid!,
                    id01: params?.chatID,
                    type: 'message',
                    imageUrl: currentUser!.userImg
                },
            }, [receiveUser?.uid!])
        }

        setLoading(false)

    }, [medias, docs, loading])

    const renderBubble = (props: any) => {
        const { currentMessage } = props
        const isMessageMedia = (currentMessage.image || currentMessage.video) && currentMessage.text == ''

        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: isMessageMedia ? 'transparent' : COLORS.socialBlue2
                    },
                    left: {
                        backgroundColor: isMessageMedia ? 'transparent' : COLORS.darkGrey
                    }
                }}
                textStyle={{
                    right: {
                        color: COLORS.white
                    },
                    left: {
                        color: COLORS.white
                    }
                }}
            />
        )
    }

    const renderSend = (props: any) => {
        const messages: MessageItemModel[] = [{
            _id: uuid.v4().toString(),
            createdAt: new Date(),
            text: props.text,
            user: props.user
        }]

        if (loading) {
            return (
                <View style={styles.buttonSend}>
                    <ActivityIndicator color={COLORS.socialBlue} size={35} />
                </View>
            )
        }

        return (
            <TouchableOpacity
                onPress={() => onSend(messages)}
                style={{
                    alignSelf: 'center',
                    justifyContent: 'center',
                }}
            >
                <LinearGradient colors={[COLORS.gradient[0], COLORS.gradient[1]]} style={styles.buttonSend}>
                    <UtilIcons.svgSend color={COLORS.socialWhite} />
                </LinearGradient>
            </TouchableOpacity>
        )
    }

    const scrollToBottomComponent = () => {
        return (
            <Ionicons name='arrow-down-circle-outline' size={SIZES.icon} color={COLORS.lightGrey} />
        )
    }

    const renderSystemMessage = (props: any) => {
        return (
            <SystemMessage
                {...props}
                containerStyle={{ backgroundColor: 'pink' }}
                wrapperStyle={{ borderWidth: 10, borderColor: 'white' }}
                textStyle={{ color: 'crimson', fontWeight: '900' }}
            />
        )
    }

    const renderAvatar = (props: any) => {
        return (
            <Avatar
                {...props}
                imageStyle={{ left: { width: 28, height: 28 }, right: {} }}
            />
        )
    }

    const renderComposer = (props: any) => {
        return (
            <Composer
                {...props}
                textInputStyle={{
                    ...FONTS.body3,
                    color: COLORS.socialWhite,
                    marginBottom: 0,
                    backgroundColor: COLORS.darkGrey,
                    borderRadius: 32,
                    paddingHorizontal: SIZES.base,
                    overflow: 'hidden'
                }}
                placeholderTextColor={COLORS.socialWhite}
            />
        )
    }

    const renderInputToolbar = (props: any) => {
        return (
            <InputToolbar
                {...props}
                containerStyle={{
                    backgroundColor: COLORS.darkBlack,
                    paddingVertical: SIZES.padding,
                }}
                accessoryStyle={{ height: SIZES.base }}
            />
        )
    }

    const renderFooter = () => {

        const renderDelButton = () => {
            return (
                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        top: -5,
                        right: -5,
                        borderRadius: SIZES.radius,
                        backgroundColor: COLORS.socialWhite
                    }}
                    onPress={() => {
                        setMedias([])
                        setDocs([])
                    }}
                >
                    <UtilIcons.svgClose size={SIZES.icon} color={COLORS.black} />
                </TouchableOpacity>
            )
        }

        if (medias && medias.length > 0) {
            const media = medias[0]
            const isImage = medias[0].mime.includes('image') ? true : false
            return (
                <View style={{ padding: SIZES.padding }}>
                    <View style={{ width: 80, height: 80 }}>
                        {isImage ? (
                            <Image source={{ uri: media.path }} style={{ width: '100%', height: '100%', borderRadius: SIZES.radius }} />
                        ) : (
                            <Video
                                source={{ uri: media.path }}
                                style={{ width: '100%', height: '100%', borderRadius: SIZES.radius }}
                                resizeMode="cover"
                                repeat
                            />
                        )}
                        {renderDelButton()}
                    </View>

                </View>
            )
        }

        if (isCamera) {
            const types = ['Photo', 'Video']
            return (
                <View style={{ paddingVertical: SIZES.padding, flexDirection: 'row', gap: SIZES.base }}>
                    {types.map((type: string, _) => {
                        return (
                            <TouchableOpacity
                                key={type}
                                style={styles.buttonOptions}
                                onPress={() => openCamera(type.toLowerCase())}
                            >
                                <TextComponent text={type} numberOfLines={1} />
                            </TouchableOpacity>
                        )
                    })}
                </View>
            )
        }

        if (docs && docs.length > 0) {
            return (
                <View style={{ margin: SIZES.padding, padding: SIZES.padding, width: 230, backgroundColor: COLORS.darkGrey, borderRadius: SIZES.radius }}>
                    <DocumentGrid documentArray={docs} />
                    {renderDelButton()}
                </View>

            )
        }

        return <></>
    }

    const openCamera = (type: 'photo' | 'video' | any) => {
        setIsCamera(false)
        ImagePicker.openCamera({
            width: 1200,
            height: 780,
            mediaType: type
        }).then(medias => {
            setMedias([medias])
        }).catch(error => {
            showNotification(error.toString(), () => <UtilIcons.warning />, 'warning')
        })
    }

    const renderActions = (props: any) => {

        const toggleCamera = () => {
            setIsCamera(pre => !pre)
            setMedias([])
        }

        const chooseMedia = () => {
            ImagePicker.openPicker({
                width: 1200,
                height: 780,
                multiple: true,
                mediaType: 'any'
            }).then(medias => {
                setMedias(medias)
            }).catch(error => {
                showNotification(error.toString(), () => <UtilIcons.warning />, 'warning')
            })
        }

        const handleAttachment = async () => {
            await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf, DocumentPicker.types.docx, DocumentPicker.types.doc],
                copyTo: 'cachesDirectory'
            }).then(async doc => {
                const data = doc[0]
                const url = decodeURIComponent(data.fileCopyUri!)
                if (url) {
                    setDocs([{ name: data.name, type: data.type, url: url.toString(), size: data.size ? data.size : 0 }])
                }
            }).catch(error => {
                showNotification(error.toString(), () => <UtilIcons.warning />, 'warning')
            })
        }

        return (
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                gap: SIZES.base,
                paddingLeft: SIZES.base,
                alignSelf: 'center'
            }}>
                <TouchableOpacity onPress={toggleCamera} >
                    <UtilIcons.svgCamera color={COLORS.socialWhite} size={SIZES.icon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={chooseMedia} >
                    <UtilIcons.svgImage color={COLORS.socialWhite} size={SIZES.icon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleAttachment} >
                    <UtilIcons.svgAttachment color={COLORS.socialWhite} size={SIZES.icon} />
                </TouchableOpacity>
            </View>
        )
    }

    const renderMessageVideo = (props: any) => {
        const { currentMessage } = props
        return (
            <Video
                source={{ uri: currentMessage.video }}
                style={{ width: 200, height: 100, borderRadius: SIZES.radius }}
                resizeMode="cover"
                repeat
            />
        )
    }

    const renderTime = (props: any) => {
        const { currentMessage } = props
        const isMessageMedia = currentMessage.image || currentMessage.video || !currentMessage.text

        return (
            <View
                style={[
                    {
                        marginHorizontal: SIZES.base,
                    },
                    isMessageMedia ? {
                        backgroundColor: COLORS.lightGrey,
                        borderRadius: SIZES.base,
                        paddingHorizontal: SIZES.base,
                        marginBottom: SIZES.base,
                    } : undefined
                ]}
            >
                <TextComponent text={moment(currentMessage.createdAt).format('HH:mm')} size={10} color={isMessageMedia ? COLORS.socialWhite : COLORS.lightGrey3} />
            </View>
        )

    }

    const renderMessage = (props: any) => {

        const { currentMessage, user } = props
        const isCurrentUser = currentMessage.user._id === user._id

        if (currentMessage.document) {
            return (
                <View style={{ marginTop: SIZES.base }}>
                    <View style={{
                        marginHorizontal: SIZES.base,
                        borderRadius: SIZES.radius,
                        alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
                        backgroundColor: isCurrentUser ? COLORS.socialBlue2 : COLORS.darkGrey,
                    }}>
                        <View style={{ padding: SIZES.base }}>
                            <DocumentGrid documentArray={[currentMessage.document]} colorTextSize={COLORS.lightGrey3} />
                        </View>

                        {currentMessage.text ? <TextComponent text={currentMessage.text} style={{ paddingLeft: SIZES.base }} /> : <></>}

                    </View>
                    <View
                        style={{
                            marginHorizontal: SIZES.base,
                            backgroundColor: COLORS.lightGrey,
                            borderRadius: SIZES.base,
                            paddingHorizontal: SIZES.base,
                            marginTop: 2,
                            marginBottom: SIZES.padding,
                            alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
                        }}
                    >
                        <TextComponent text={moment(currentMessage.createdAt).format('HH:mm')} size={10} color={COLORS.socialWhite} />
                    </View>
                </View>
            )
        }
        return (
            <Message {...props} />
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.darkBlack }}>
            <Header
                title={'CREATE'}
                containerStyle={{ marginBottom: SIZES.padding }}
                centerComponent={
                    <View style={{ alignItems: 'center' }}>
                        <CustomAvatar source={{ uri: receiveUser.userImg }} size='m' />
                        <TextComponent text={`${receiveUser.fname} ${receiveUser.lname}`} style={{ fontWeight: 'bold', marginTop: 4 }} />
                    </View>
                }
                leftComponent={
                    <TouchableOpacity style={styles.btnHeaderLeft} onPress={() => navigation.goBack()}>
                        <UtilIcons.svgArrowLeft color={COLORS.socialWhite} size={20} />
                    </TouchableOpacity>
                }
                rightComponent={
                    <TouchableOpacity
                        style={styles.btnHeaderLeft}
                        onPress={() => handleOpenBottomSheet()}>
                        <UtilIcons.svgDotsVertical color={COLORS.socialWhite} size={20} />
                    </TouchableOpacity>
                }
            />
            <Divider />
            <View style={{ flex: 1 }}>
                <GiftedChat
                    messages={messages}

                    user={{
                        _id: currentUser.uid,
                    }}
                    onSend={messages => onSend(messages)}
                    textInputRef={inputRef}
                    renderBubble={renderBubble}
                    alwaysShowSend
                    renderSend={renderSend}
                    scrollToBottom
                    scrollToBottomComponent={scrollToBottomComponent}
                    placeholder='Type your message here...'
                    renderInputToolbar={renderInputToolbar}
                    renderComposer={renderComposer}
                    renderChatFooter={() => <View style={{ height: 20 }} />}
                    renderSystemMessage={renderSystemMessage}
                    renderAvatar={renderAvatar}
                    renderActions={renderActions}
                    renderFooter={renderFooter}
                    renderMessageVideo={renderMessageVideo}
                    renderTime={renderTime}
                    text={text}
                    onInputTextChanged={setText}
                    renderMessage={renderMessage}
                />
            </View>
            {renderBottomSheet()}
        </View>

    )
}

export default ChatScreen

const styles = StyleSheet.create({
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
    buttonSend: {
        width: 32,
        height: 32,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        margin: SIZES.base
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SIZES.padding,
    },
    buttonOptions: {
        alignItems: 'center',
        borderRadius: SIZES.radius,
        padding: SIZES.base,
        borderWidth: 1,
        borderColor: COLORS.socialWhite,
        width: 60
    }
})