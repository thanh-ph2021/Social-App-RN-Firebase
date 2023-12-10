import { useCallback } from 'react'
import { View, FlatList, ListRenderItemInfo } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { COLORS } from '../constants'
import { MessageModel } from '../Models'
import { MessageCard } from '../components'
import { useFocusEffect } from '@react-navigation/native'
import { useChat } from '../hooks'

const MessagesScreen = ({ navigation }: NativeStackScreenProps<any>) => {

    const [data, messages, setMessages, isLoading, collection, getChat, addChatData, updateChat, addMessage, loadMessageRealTime] = useChat()

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

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.white }}>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
        </View>
    )
}

export default MessagesScreen