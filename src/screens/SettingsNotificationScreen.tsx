import { StyleSheet, Switch, View } from 'react-native'
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { COLORS, FONTS, SIZES } from '../constants'
import { Header, TextComponent } from '../components'
import { UtilIcons } from '../utils/icons'
import { utilStyles } from '../styles'
import { useAppDispatch, useAppSelector } from '../hooks'
import { COMMENT_NOTI, FOLLOW_NOTI, LIKE_NOTI } from '../redux/constants/asyncstorage'
import { updateStorage } from '../redux/actions/asyncstorage'

const SettingsNotificationScreen = ({ navigation }: NativeStackScreenProps<any>) => {

    const { commentNoti, followNoti, likeNoti } = useAppSelector(state => state.asyncstorageState)
    const dispatch = useAppDispatch()

    return (
        <View style={styles.container}>
            <Header
                title={'Settings Notification'}
                leftComponent={
                    <TouchableOpacity style={utilStyles.btnHeaderLeft} onPress={() => navigation.goBack()}>
                        <UtilIcons.svgArrowLeft color={COLORS.socialWhite} />
                    </TouchableOpacity>
                }
            />
            <View style={styles.content}>
                <TextComponent text={'Push Notifications'.toUpperCase()} color={COLORS.lightGrey} style={{ ...FONTS.h3 }} />

                <TouchableWithoutFeedback
                    style={styles.row}
                    onPress={() => dispatch(updateStorage(FOLLOW_NOTI, !followNoti))}
                >
                    <View>
                        <TextComponent text={'Followers'} color={COLORS.socialWhite} style={{ ...FONTS.body3 }} />
                        <TextComponent text={'When someone Follows you'} color={COLORS.lightGrey} style={{ ...FONTS.body4 }} />
                    </View>
                    <Switch
                        trackColor={{ false: COLORS.lightGrey, true: COLORS.socialPink2 }}
                        thumbColor={followNoti ? COLORS.socialPink : COLORS.lightGrey2}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => dispatch(updateStorage(FOLLOW_NOTI, !followNoti))}
                        value={followNoti}
                    />
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback
                    style={styles.row}
                    onPress={() => dispatch(updateStorage(COMMENT_NOTI, !commentNoti))}
                >
                    <View>
                        <TextComponent text={'Comment'} color={COLORS.socialWhite} style={{ ...FONTS.body3 }} />
                        <TextComponent text={'When someone Comment on your post'} color={COLORS.lightGrey} style={{ ...FONTS.body4 }} />
                    </View>
                    <Switch
                        trackColor={{ false: COLORS.lightGrey, true: COLORS.socialPink2 }}
                        thumbColor={commentNoti ? COLORS.socialPink : COLORS.lightGrey2}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => dispatch(updateStorage(COMMENT_NOTI, !commentNoti))}
                        value={commentNoti}
                    />
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback
                    style={styles.row}
                    onPress={() => dispatch(updateStorage(LIKE_NOTI, !likeNoti))}
                >
                    <View>
                        <TextComponent text={'Likes'} color={COLORS.socialWhite} style={{ ...FONTS.body3 }} />
                        <TextComponent text={'When someone Likes your post'} color={COLORS.lightGrey} style={{ ...FONTS.body4 }} />
                    </View>
                    <Switch
                        trackColor={{ false: COLORS.lightGrey, true: COLORS.socialPink2 }}
                        thumbColor={likeNoti ? COLORS.socialPink : COLORS.lightGrey2}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => dispatch(updateStorage(LIKE_NOTI, !likeNoti))}
                        value={likeNoti}
                    />
                </TouchableWithoutFeedback>
            </View>
        </View >
    )
}

export default SettingsNotificationScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.darkBlack,
    },

    content: {
        paddingHorizontal: SIZES.padding
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SIZES.padding,
    }
})