import { useEffect, useState } from "react"
import { FlatList, SectionList, Text, View, TouchableOpacity } from "react-native"
import moment from "moment"

import { COLORS, SIZES } from "../constants"
import { Divider, TextComponent } from "../components"
import { UtilIcons } from "../utils/icons"

const date = new Date()
const yesterday = date.setDate(date.getDate() - 1)

const notiDatas = [
    {
        id: 1,
        title: 'Sofia, John and +19 others liked your post.',
        date: new Date(),
        type: 'like',
        isRead: 0
    },
    {
        id: 2,
        title: 'Rebecca, Daisy and +11 others liked your post.',
        date: new Date(),
        type: 'like',
        isRead: 0
    },
    {
        id: 3,
        title: 'Katrina, Denver and +2 others commented on your post.',
        date: yesterday,
        type: 'comment',
        isRead: 1
    },
    {
        id: 4,
        title: 'Savannah Wilson is celebrating birthday today. Drop a wish! 🎉',
        date: yesterday,
        type: 'birthday',
        isRead: 1
    },
    {
        id: 5,
        title: 'Ralph Edwards mentioned you in a post.',
        date: date.setDate(date.getDate() - 2),
        type: 'mention',
        isRead: 1
    },

]

const NotificationScreen = () => {

    const [datas, setDatas] = useState<any>([])

    useEffect(() => {
        const groups = notiDatas.reduce((groups: any, data: any) => {
            const date = moment(data.date).format('DD/MM/YYYY')
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(data);
            return groups;
        }, {})


        // Edit: to add it in the array format instead
        const groupArrays = Object.keys(groups).map((date) => {
            return {
                date,
                data: groups[date]
            };
        })

        setDatas(groupArrays)
    }, [])


    return (
        <View style={{ flex: 1, backgroundColor: COLORS.darkBlack }}>
            {/* Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SIZES.padding }}>
                <TextComponent
                    title={true}
                    text='Notifications'
                    style={{ fontWeight: 'bold' }}
                />
                <TouchableOpacity>
                    <TextComponent
                        text='Mark all as read'
                        style={{ fontWeight: 'bold' }}
                        color={COLORS.socialPink}
                    />
                </TouchableOpacity>
            </View>

            {datas && (
                <SectionList
                    sections={datas}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{ rowGap: SIZES.padding }}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity>
                                <View style={{ flexDirection: 'row', alignItems: 'center', padding: SIZES.padding }}>
                                    <View style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 30,
                                        backgroundColor: COLORS.darkGrey,
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {
                                            item.type == 'like' ? <UtilIcons.svgLike color={COLORS.socialBlue} /> :
                                                item.type == 'comment' ? <UtilIcons.svgComment color={COLORS.socialPink} /> :
                                                    item.type == 'birthday' ? <TextComponent color={COLORS.socialBlue} text={'S'} /> :
                                                        item.type == 'mention' ? <TextComponent text={'@'} /> : <></>
                                        }
                                    </View>
                                    <View style={{ width: '86%', paddingLeft: SIZES.padding }}>
                                        <TextComponent
                                            text={item.title}
                                            color={item.isRead ? COLORS.lightGrey : COLORS.socialWhite}
                                        />
                                        <TextComponent color={COLORS.lightGrey} text={moment(item.date).startOf('day').fromNow()} />
                                    </View>
                                </View>
                                <Divider height={1} />
                            </TouchableOpacity>
                        )
                    }}
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
            )
            }

        </View>
    )
}

export default NotificationScreen