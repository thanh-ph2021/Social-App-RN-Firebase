import { useMemo, useRef } from 'react'
import { StyleSheet, Switch, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useCallback, useEffect } from 'react'
import { GiftedChat, Bubble, Send, Composer, InputToolbar, Avatar, SystemMessage } from 'react-native-gifted-chat'
import Ionicons from 'react-native-vector-icons/Ionicons'
import LinearGradient from 'react-native-linear-gradient'
import { useRoute } from '@react-navigation/native'

import { COLORS, FONTS, SIZES } from '../constants'
import { useAppDispatch, useAppSelector } from '../hooks'
import { MessageItemModel, UserModel } from '../models'
import { Avatar as CustomAvatar, Divider, Header, Icon, TextComponent } from '../components'
import { UtilIcons } from '../utils/icons'
import { fetchMessagesRealTime, sendMessage } from '../redux/actions/message'
import { selectChatByChatId, selectMessagesByChatId } from '../redux/selectors'
import { sendNotification } from '../redux/actions/notification'
import { IconArray } from './PostDetailScreen'
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet'
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types'
import { pinConversation } from '../redux/actions/chat'
import { showNotification } from '../utils'

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
            </BottomSheet>
        )
    }

    const onSend = useCallback((messages: MessageItemModel[] | any[] = []) => {

        dispatch(sendMessage(params?.chatID, messages))
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
    }, [])

    const renderBubble = (props: any) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: COLORS.socialBlue
                    },
                    left: {
                        backgroundColor: COLORS.darkGrey
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
        return (
            <Send {...props} containerStyle={{
                alignSelf: 'center',
                justifyContent: 'center',
            }}>
                <LinearGradient colors={[COLORS.gradient[0], COLORS.gradient[1]]} style={styles.buttonSend}>
                    <UtilIcons.svgSend color={COLORS.socialWhite} />
                </LinearGradient>
            </Send>
        )
    }

    const scrollToBottomComponent = () => {
        return (
            <Ionicons name='arrow-down-circle-outline' size={SIZES.icon} color={COLORS.lightGrey} />
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
                        onPress={handleOpenBottomSheet}>
                        <UtilIcons.svgDotsVertical color={COLORS.socialWhite} size={20} />
                    </TouchableOpacity>
                }
            />
            <Divider />
            <View style={{ flex: 1 }}>
                <GiftedChat
                    messages={messages}
                    onSend={messages => onSend(messages)}
                    user={{
                        _id: currentUser.uid,
                    }}
                    textInputRef={inputRef}
                    renderBubble={renderBubble}
                    alwaysShowSend
                    renderSend={renderSend}
                    scrollToBottom
                    scrollToBottomComponent={scrollToBottomComponent}
                    placeholder='Type your message here...'
                    renderInputToolbar={(props) => {
                        return (
                            <InputToolbar
                                {...props}
                                containerStyle={{
                                    backgroundColor: COLORS.darkBlack,
                                    paddingVertical: SIZES.padding,
                                    margin: 0,
                                }}
                                // primaryStyle={{ alignItems: 'center', backgroundColor: COLORS.darkGrey, borderRadius: 32 }}
                                accessoryStyle={{ height: SIZES.base }}
                                renderActions={() => {
                                    return (
                                        <View style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-around',
                                            gap: SIZES.base,
                                            paddingLeft: SIZES.base,
                                            alignSelf: 'center'
                                        }}>
                                            {IconArray.map((item, index) => {
                                                return (
                                                    <TouchableOpacity onPress={item.onPress} key={index}>
                                                        <Icon type={item.type} name={item.name} color={COLORS.socialWhite} size={SIZES.icon} />
                                                    </TouchableOpacity>
                                                )
                                            })}
                                        </View>
                                    )
                                }}
                            />
                        )
                    }}
                    renderComposer={(props) => {
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
                    }}
                    renderChatFooter={() => {
                        return (
                            <View style={{ height: 20 }} />
                        )
                    }}
                    renderSystemMessage={(props) => (
                        <SystemMessage
                            {...props}
                            containerStyle={{ backgroundColor: 'pink' }}
                            wrapperStyle={{ borderWidth: 10, borderColor: 'white' }}
                            textStyle={{ color: 'crimson', fontWeight: '900' }}
                        />
                    )}
                    renderAvatar={(props) => (
                        <Avatar
                            {...props}
                            imageStyle={{ left: { width: 28, height: 28 }, right: {} }}
                        />
                    )}
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
    }
})