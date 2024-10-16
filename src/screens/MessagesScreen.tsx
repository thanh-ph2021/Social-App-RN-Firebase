import { View, FlatList, ListRenderItemInfo, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { Divider, EmptyComponent, Header, InputBar, MessageCard, TextComponent } from '../components'
import { COLORS, SIZES } from '../constants'
import { MessageModel } from '../models'
import { useAppDispatch, useAppSelector } from '../hooks'
import { UtilIcons } from '../utils/icons'
import { useState } from 'react'
import { searchChat } from '../redux/actions/chat'
import { selectConversationPinned } from '../redux/selectors'
import { showNotificationComingSoon } from '../utils'

const MessagesScreen = ({ navigation }: NativeStackScreenProps<any>) => {

    const { conversations, searchConversations } = useAppSelector(state => state.chatState)
    const pinnedConversations = useAppSelector(state => selectConversationPinned(state))
    const dispatch = useAppDispatch()
    const [searchText, setSearchText] = useState<string>('')

    const onChangeText = async (text: string) => {
        setSearchText(text)
        await dispatch(searchChat(searchText))
    }

    const renderItem = ({ item }: ListRenderItemInfo<MessageModel>) => {
        return (
            <MessageCard item={item} navigation={navigation} />
        )
    }

    const renderItemPinned = ({ item }: ListRenderItemInfo<MessageModel>) => {
        return (
            <MessageCard item={item} navigation={navigation} type='pinned' />
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.darkBlack }}>
            <Header
                title={'Messages'}
                leftComponent={
                    <TouchableOpacity style={styles.btnHeaderLeft} onPress={() => navigation.goBack()}>
                        <UtilIcons.svgArrowLeft color={COLORS.socialWhite} />
                    </TouchableOpacity>
                }
                rightComponent={
                    <TouchableOpacity style={styles.btnHeaderLeft} onPress={() => showNotificationComingSoon()}>
                        <UtilIcons.svgSettings color={COLORS.socialWhite} />
                    </TouchableOpacity>
                }
            />
            <ScrollView>
                <InputBar
                    placeholder='Who do you want to chat with?'
                    mainButton={
                        <View style={{ paddingRight: SIZES.base }}>
                            {searchText ? (
                                <TouchableOpacity
                                    onPress={() => setSearchText('')}
                                    style={{ backgroundColor: COLORS.lightGrey, borderRadius: SIZES.radius, padding: 2 }}
                                >
                                    <UtilIcons.svgClose color={COLORS.socialWhite} />
                                </TouchableOpacity>
                            ) : (<UtilIcons.svgSearch color={COLORS.lightGrey} />)}
                        </View>
                    }
                    onChangeText={onChangeText}
                    value={searchText}
                    multiline={false}
                />

                {/* list people have pinned */}
                {
                    searchText ? (
                        <FlatList
                            data={searchConversations}
                            scrollEnabled={false}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id!}
                            ItemSeparatorComponent={() => <Divider />}
                        />
                    ) : (
                        conversations && conversations.length > 0 ? (
                            <>
                                {pinnedConversations.length > 0
                                    ? <View style={styles.listPinned}>
                                        <TextComponent text='PINNED' color={COLORS.lightGrey} />
                                        <FlatList
                                            horizontal
                                            data={pinnedConversations}
                                            renderItem={renderItemPinned}
                                            keyExtractor={(item, index) => `${item.id!}_${index}`}
                                            contentContainerStyle={{ gap: SIZES.padding * 2 }}
                                        />
                                    </View>
                                    : <></>
                                }

                                <Divider />
                                <FlatList
                                    data={conversations}
                                    scrollEnabled={false}
                                    renderItem={renderItem}
                                    keyExtractor={(item, index) => `${item.id!}_${index}`}
                                    ItemSeparatorComponent={() => <Divider />}
                                />
                            </>
                        ) : (
                            <EmptyComponent title='No conversation' subTitle="Let's create a conversation, connect with friends." />
                        )
                    )
                }
            </ScrollView>
        </View>
    )
}

export default MessagesScreen

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

    listPinned: {
        margin: SIZES.padding,
    }
}) 