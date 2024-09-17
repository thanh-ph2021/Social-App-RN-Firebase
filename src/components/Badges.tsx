import { memo } from 'react'
import { View } from 'react-native'
import { COLORS, SIZES } from '../constants'
import TextComponent from './TextComponent'

interface Props {
    unreadCount: number
}

const Badges = (props: Props) => {
    const { unreadCount } = props

    return (
        unreadCount > 0 && <View style={{
            position: 'absolute',
            height: 28,
            width: 28,
            backgroundColor: COLORS.redLight,
            borderRadius: SIZES.radius,
            borderWidth: 3,
            borderColor: COLORS.darkBlack,
            justifyContent: 'center',
            alignItems: 'center',
            right: 0,
            top: -3
        }}>
            <TextComponent text={unreadCount > 99 ? `99+` : unreadCount.toString()} size={12} />
        </View>
    )
}

export default memo(Badges)