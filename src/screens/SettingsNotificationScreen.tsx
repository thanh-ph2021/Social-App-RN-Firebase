import { StyleSheet, Switch, View } from 'react-native'
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { useEffect, useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { COLORS, FONTS, SIZES } from '../constants'
import { Header, TextComponent } from '../components'
import { UtilIcons } from '../utils/icons'
import { utilStyles } from '../styles'

const SettingsNotificationScreen = ({ navigation }: NativeStackScreenProps<any>) => {

    const [isFollowersEnabled, setIsFollowersEnabled] = useState(false)
    const [isCommentsEnabled, setIsCommentsEnabled] = useState(false)
    const [isLikesEnabled, setIsLikesEnabled] = useState(false)

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
                    onPress={() => setIsFollowersEnabled(prev => !prev)}
                >
                    <View>
                        <TextComponent text={'Followers'} color={COLORS.socialWhite} style={{ ...FONTS.body3 }} />
                        <TextComponent text={'When someone Follows you'} color={COLORS.lightGrey} style={{ ...FONTS.body4 }} />
                    </View>
                    <Switch
                        trackColor={{ false: COLORS.lightGrey, true: COLORS.socialPink2 }}
                        thumbColor={isFollowersEnabled ? COLORS.socialPink : COLORS.lightGrey2}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => setIsFollowersEnabled(prev => !prev)}
                        value={isFollowersEnabled}
                    />
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback
                    style={styles.row}
                    onPress={() => setIsCommentsEnabled(prev => !prev)}
                >
                    <View>
                        <TextComponent text={'Comment'} color={COLORS.socialWhite} style={{ ...FONTS.body3 }} />
                        <TextComponent text={'When someone Comment on your post'} color={COLORS.lightGrey} style={{ ...FONTS.body4 }} />
                    </View>
                    <Switch
                        trackColor={{ false: COLORS.lightGrey, true: COLORS.socialPink2 }}
                        thumbColor={isCommentsEnabled ? COLORS.socialPink : COLORS.lightGrey2}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => setIsCommentsEnabled(prev => !prev)}
                        value={isCommentsEnabled}
                    />
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback
                    style={styles.row}
                    onPress={() => setIsLikesEnabled(prev => !prev)}
                >
                    <View>
                        <TextComponent text={'Likes'} color={COLORS.socialWhite} style={{ ...FONTS.body3 }} />
                        <TextComponent text={'When someone Likes your post'} color={COLORS.lightGrey} style={{ ...FONTS.body4 }} />
                    </View>
                    <Switch
                        trackColor={{ false: COLORS.lightGrey, true: COLORS.socialPink2 }}
                        thumbColor={isLikesEnabled ? COLORS.socialPink : COLORS.lightGrey2}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => setIsLikesEnabled(prev => !prev)}
                        value={isLikesEnabled}
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