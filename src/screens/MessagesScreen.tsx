import { useCallback } from 'react'
import { View, FlatList, ListRenderItemInfo, TouchableOpacity, StyleSheet } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useFocusEffect } from '@react-navigation/native'

import { Divider, Header, InputBar, MessageCard, TextComponent } from '../components'
import { COLORS, SIZES } from '../constants'
import { MessageModel } from '../models'
import { useChat } from '../hooks'
import { UtilIcons } from '../utils/icons'

const MessagesScreen = ({ navigation }: NativeStackScreenProps<any>) => {

    const { data, getChat } = useChat()

    useFocusEffect(
        useCallback(() => {
            getChat()
        }, [])
    )

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
                    <TouchableOpacity style={styles.btnHeaderLeft} onPress={() => console.log('settings')}>
                        <UtilIcons.svgSettings color={COLORS.socialWhite} />
                    </TouchableOpacity>
                }
            />
            <InputBar
                placeholder='Who do you want to chat with?'
                mainButton={
                    <View style={{ paddingRight: SIZES.base }}>
                        <UtilIcons.svgSearch color={COLORS.lightGrey} />
                    </View>
                }
            />
            <Divider height={1} />
            {/* list people have pinned */}
            <View style={styles.listPinned}>
                <TextComponent text='PINNED' color={COLORS.lightGrey} />
                <FlatList
                    horizontal
                    data={data}
                    renderItem={renderItemPinned}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ gap: SIZES.padding * 2 }}
                />
            </View>

            <Divider />
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={() => <Divider />}
            />
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