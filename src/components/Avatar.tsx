import { Image, ImageSourcePropType } from "react-native"

type AvatarProps = {
    source: ImageSourcePropType,
    size: 'xl' | 'l' | 'm' | 's'
}

const Avatar = (props: AvatarProps) => {

    const { source, size } = props
    let wh = 24

    // l= 40, m= 30, s= 20
    switch (size) {
        case 'xl':
            wh = 48
            break
        case 'l':
            wh = 40
            break
        case 'm':
            wh = 32
            break
        case 's':
            wh = 24
            break
    }

    return (
        <Image
            source={source}
            style={{
                width: wh,
                height: wh,
                borderRadius: wh - 5
            }}
        />
    )
}

export default Avatar