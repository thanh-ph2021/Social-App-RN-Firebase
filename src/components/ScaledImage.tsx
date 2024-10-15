import { useEffect, useState } from "react"
import { Image } from "react-native"

interface Props {
    uri: string,
    width?: number,
    height?: number
}

const ScaledImage = (props: Props) => {
    const { uri, width, height } = props
    const [size, setSize] = useState({
        width,
        height
    })

    useEffect(() => {
        Image.getSize(uri, (w, h) => {
            if (size.width && !size.height) {
                setSize({
                    width: size.width,
                    height: h * (size.width / w)
                })
            } else if (!size.width && size.height) {
                setSize({
                    width: w * (size.height / h),
                    height: h
                })
            } else {
                setSize({
                    width: w,
                    height: h
                })
            }
        })
    }, [])

    return (
        <Image
            source={{ uri }}
            style={{ width: size.width, height: size.height }}
        />
    )
}

export default ScaledImage