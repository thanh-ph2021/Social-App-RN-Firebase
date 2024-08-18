import { View } from 'react-native'

import TextComponent from './TextComponent'
import { utilStyles } from '../styles'
import { COLORS, FONTS } from '../constants'

interface Props {
    title?: string,
    subTitle?: string
}

const EmptyComponent = (props: Props) => {

    const { title, subTitle } = props
    return (
        <View style={[utilStyles.container, { height: 100 }]}>
            {title && <TextComponent text={title} style={{ ...FONTS.body3 }} />}
            {subTitle && <TextComponent text={subTitle} color={COLORS.lightGrey} />}
        </View>
    )
}

export default EmptyComponent