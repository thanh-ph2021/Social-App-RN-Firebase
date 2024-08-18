import { View } from "react-native"

import { useAppSelector } from "../hooks"
import { selectUserByUID } from "../redux/selectors"
import Avatar from "./Avatar"
import { UserModel } from "../models"
import { images, SIZES } from "../constants"
import TextComponent from "./TextComponent"

interface Props {
    uid: string,
    onPress: () => void
}

const UserComponent = (props: Props) => {

    const { uid, onPress } = props
    const user: UserModel = useAppSelector(state => selectUserByUID(state, uid))

    return (
        <View style={{ flexDirection: 'row', gap: SIZES.padding }}>
            {user.userImg
                ? <Avatar source={{ uri: user.userImg }} size={"l"} onPress={onPress} />
                : <Avatar source={images.defaultImage} size={"s"} onPress={onPress} />}
            <TextComponent text={`${user.fname} ${user.lname}`} style={{ alignSelf: 'center' }} />
        </View>
    )
}

export default UserComponent