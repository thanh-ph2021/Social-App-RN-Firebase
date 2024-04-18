import { StyleSheet, Image, ImageSourcePropType } from "react-native"

type AvatarProps = {
    source: ImageSourcePropType
}

const Avatar = ({source}: AvatarProps) => {
    return (
        <Image source={source} style={styles.avatar}/>
    )
}

export default Avatar

const styles = StyleSheet.create({
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 40
    }
})