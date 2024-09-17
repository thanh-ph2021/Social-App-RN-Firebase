import { useEffect, useState } from "react"
import { FlatList, SectionList, Text, View, TouchableOpacity, RefreshControl, ListRenderItemInfo, ActivityIndicator } from "react-native"
import moment from "moment"
import { shallowEqual } from "react-redux"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import LottieView from "lottie-react-native"

import { COLORS, SIZES } from "../constants"
import { TextComponent } from "../components"
import { useAppDispatch, useAppSelector } from "../hooks"
import { fetchNextNotifications, fetchNotifications, markAllReadNoti } from "../redux/actions/notification"
import NotificationCard from "../components/NotificationCard"
import { utilStyles } from "../styles"

const date = new Date()
const yesterday = date.setDate(date.getDate() - 1)

const tagDatas = [
    {
        id: 1,
        name: 'All'
    },
    {
        id: 2,
        name: 'Unread'
    },
]

const NotificationScreen = ({ navigation }: NativeStackScreenProps<any>) => {

    const [datas, setDatas] = useState<any>([])
    const { notifications, hashMore } = useAppSelector(state => state.notificationState, shallowEqual)
    const dispatch = useAppDispatch()
    const [refreshing, setRefreshing] = useState(false)
    const [tag, setTag] = useState<number>(1)

    useEffect(() => {
        const groups = notifications.reduce((groups: any, data: any) => {
            const date = moment(data.createdAt.seconds * 1000).format('DD/MM/YYYY')
            if (!groups[date]) {
                groups[date] = []
            }
            if (tag == 1) {
                groups[date].push(data)
            } else {
                // get unread notification
                data.isRead == false && groups[date].push(data)
            }
            return groups
        }, {})

        // Edit: to add it in the array format instead
        const groupArrays = Object.keys(groups).map((date) => {
            return {
                date,
                data: groups[date]
            }
        })

        // remove data = []
        setDatas(groupArrays.filter(item => item.data.length > 0))

    }, [notifications, tag])

    const onRefresh = async () => {
        setRefreshing(true)
        await dispatch(fetchNotifications())
        setRefreshing(false)
    }

    const handleAllRead = async () => {
        await dispatch(markAllReadNoti())
    }

    const onEndReached = async () => {
        await dispatch(fetchNextNotifications())
    }

    const renderTag = ({ item }: ListRenderItemInfo<{ id: number, name: string }>) => {

        const onPress = () => {
            setTag(item.id)
        }

        return (
            <TouchableOpacity style={{
                borderWidth: 1,
                padding: SIZES.base,
                borderRadius: 18,
                borderColor: item.id == tag ? 'transparent' : COLORS.lightGrey,
                backgroundColor: item.id == tag ? COLORS.socialBlue : 'transparent'
            }} onPress={onPress}>
                <Text style={utilStyles.text}>{item.name}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.darkBlack }}>
            {/* Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SIZES.padding }}>
                <TextComponent
                    title={true}
                    text='Notifications'
                    style={{ fontWeight: 'bold' }}
                />
                <TouchableOpacity onPress={handleAllRead}>
                    <TextComponent
                        text='Mark all as read'
                        style={{ fontWeight: 'bold' }}
                        color={COLORS.socialPink}
                    />
                </TouchableOpacity>
            </View>

            <View style={{ marginLeft: SIZES.padding, marginBottom: SIZES.padding }}>
                {/* tags */}
                <FlatList
                    horizontal
                    data={tagDatas}
                    contentContainerStyle={{ columnGap: SIZES.padding, paddingVertical: SIZES.base }}
                    renderItem={renderTag}
                    keyExtractor={(item, index) => item.name + index}
                />
            </View>

            {refreshing && (
                <View style={{
                    justifyContent: 'center',
                    alignItems: "center",
                    backgroundColor: COLORS.darkBlack,
                    position: 'absolute',
                    zIndex: 99,
                    width: '100%',
                    height: '100%'
                }}>
                    <LottieView
                        source={require("../assets/animations/loader.json")}
                        style={{ width: 300, height: 300 }}
                        autoPlay
                        loop
                    />
                </View>
            )}

            {datas && (
                <SectionList
                    sections={datas}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{ rowGap: SIZES.padding }}
                    refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={false} />}
                    refreshing={refreshing}
                    renderItem={({ item }) => {
                        return (
                            <NotificationCard data={item} navigation={navigation} />
                        )
                    }}
                    onEndReached={onEndReached}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={() => hashMore ? <ActivityIndicator style={{ marginBottom: 60 }} color={COLORS.lightGrey} /> : <></>}
                    renderSectionHeader={({ section: { date } }) => {
                        return (
                            <View style={{ paddingHorizontal: SIZES.padding }}>
                                <TextComponent
                                    text={
                                        date == moment(new Date()).format('DD/MM/YYYY') ? 'TODAY' :
                                            date == moment(new Date(yesterday)).format('DD/MM/YYYY') ? 'YESTERDAY' : date
                                    }
                                    color={COLORS.lightGrey}
                                />
                            </View>
                        )
                    }}
                />
            )}

        </View>
    )
}

export default NotificationScreen