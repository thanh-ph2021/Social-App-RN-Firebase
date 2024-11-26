import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { useState } from 'react'

import Divider from './Divider'
import { UtilIcons } from '../utils/icons'
import { COLORS, FONTS, SIZES } from '../constants'
import { showNotification, showNotificationComingSoon } from '../utils'
import { UserModel } from '../models'
import { useAppDispatch, useAppSelector } from '../hooks'
import TextComponent from './TextComponent'
import AlertV1 from './Alert/AlertV1'
import { Loading } from './Loader'
import { StoryModel } from '../models/StoryModel'
import { deleteImage } from '../redux/actions/story'

interface Props {
    storyData: StoryModel,
    indexImage: number,
    onClose?: () => void, // close bottom sheet,
    callback?: () => void
}

const StoryOption = ({ storyData, indexImage, onClose, callback }: Props) => {

    const dispatch = useAppDispatch()
    const currentUser: UserModel = useAppSelector(state => state.userState.currentUser)
    const isMyStory = storyData.userId === currentUser?.uid
    const [showAlert, setShowAlert] = useState(false)
    const [processing, setProcessing] = useState(false)

    const removeHandle = async () => {
        onClose && onClose()
        setProcessing(true)

        await dispatch(deleteImage(storyData, indexImage))

        setProcessing(false)
        showNotification('Image deleted successfully', () => <UtilIcons.success />, 'success', SIZES.padding * 3)
        callback && callback()
    }

    const showComingSoon = () => {
        showNotificationComingSoon(SIZES.padding * 3)
        onClose && onClose()
    }

    const editHandle = () => {
        showComingSoon()
    }
    const hideHandle = () => {
        showComingSoon()
    }
    const reportHandle = () => {
        showComingSoon()
    }

    return (
        <>
            <TextComponent text={"Story's Options"} style={{ ...FONTS.h3, textAlign: 'center' }} />
            <Divider height={0.3} color={COLORS.lightGrey} />
            {isMyStory ? (
                <>
                    <TouchableOpacity style={styles.item} onPress={editHandle}>
                        <UtilIcons.svgAlert color={COLORS.socialWhite} />
                        <TextComponent text={"Edit story"} style={{ ...FONTS.h3 }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.item} onPress={() => setShowAlert(true)}>
                        <UtilIcons.svgTrash />
                        <TextComponent text={"Remove story"} style={{ ...FONTS.h3 }} />
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <TouchableOpacity style={styles.item} onPress={hideHandle}>
                        <UtilIcons.svgHide color={COLORS.socialWhite} size={20} />
                        <TextComponent text={"Hide story"} style={{ ...FONTS.h3 }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.item} onPress={reportHandle}>
                        <UtilIcons.svgReport color={COLORS.socialWhite} size={20} />
                        <TextComponent text={"Report story"} style={{ ...FONTS.h3 }} />
                    </TouchableOpacity>
                </>
            )}
            <AlertV1
                title='Sure you want to delete story?'
                description=''
                visible={showAlert}
                onClose={() => setShowAlert(false)}
                onConfirm={removeHandle}
            />
            <Loading visible={processing} />
        </>
    )
}

export default StoryOption

const styles = StyleSheet.create({
    item: {
        marginHorizontal: SIZES.padding,
        marginVertical: SIZES.base,
        flexDirection: 'row',
        gap: SIZES.padding,
        backgroundColor: COLORS.lightGrey2,
        padding: SIZES.base,
        borderRadius: SIZES.base
    }
}) 