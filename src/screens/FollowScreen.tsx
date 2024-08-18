import { FlatList, ListRenderItemInfo, View } from "react-native"

import { UserComponent } from "../components"
import { utilStyles } from "../styles"
import { SIZES } from "../constants"

interface Props {
    data: string[],
    navigation: any
}

const FollowScreen = (props: Props) => {

    const { data, navigation } = props

    const renderItem = ({ item }: ListRenderItemInfo<string>) => {
        return (
            <UserComponent uid={item} onPress={() => navigation.push('Profile', { userID: item })} />
        )
    }

    return (
        <View style={utilStyles.containerBackground}>
            <FlatList
                data={data}
                renderItem={renderItem}
                extraData={(item: string) => item}
                contentContainerStyle={{ margin: SIZES.padding, gap: SIZES.padding }}
            />
        </View>
    )
}

export default FollowScreen