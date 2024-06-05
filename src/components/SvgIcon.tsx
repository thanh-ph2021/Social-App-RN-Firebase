import { memo } from "react"

import { UtilIcons } from "../utils/icons"
import Icon, { TypeIcons } from "./Icon"

interface Props {
    size: number,
    color: string,
    name: string,

}

const SvgIcon = (props: Props) => {

    const { size, color, name } = props

    switch (name) {
        case 'Image':
            return <UtilIcons.svgImage size={size} color={color} />
        case 'GIF':
            return <UtilIcons.svgGIF size={size} color={color} />
        case 'Attachment':
            return <UtilIcons.svgAttachment size={size} color={color} />
        case 'Camera':
            return <UtilIcons.svgCamera size={size} color={color} />
        case 'Location':
            return <Icon type={TypeIcons.Ionicons} name={"location"} color={color} size={size} />
        case 'Checklist':
            return <Icon type={TypeIcons.MaterialIcons} name={"checklist"} color={color} size={size} />
    }
}

export default memo(SvgIcon)