import { forwardRef, useCallback, useState } from "react"
import { StyleSheet, TouchableOpacity } from "react-native"

import { COLORS, SIZES, FONTS } from "../../constants"
import AppBottomSheet from "../AppBottomSheet"
import { PostModel, UserModel } from "../../models"
import TextComponent from "../TextComponent"
import { useAppDispatch, useAppSelector } from "../../hooks"
import Divider from "../Divider"
import { UtilIcons } from "../../utils/icons"
import { showNotification, showNotificationComingSoon } from "../../utils"
import { deletePost, selectPost } from "../../redux/actions/post"
import AlertV1 from "../Alert/AlertV1"
import { Loading } from "../Loader"

interface Props {
    index: number,
    onClose?: () => void,
}

const PostOptionBottomSheet = forwardRef((
    { index = 0, onClose }: Props,
    ref: any
) => {
    const dispatch = useAppDispatch()
    const selectedPost: PostModel = useAppSelector(state => state.userState.selectedPost)
    const currentUser: UserModel = useAppSelector(state => state.userState.currentUser)
    const isMyPost = selectedPost?.userID === currentUser?.uid
    const [showAlert, setShowAlert] = useState(false)
    const [processing, setProcessing] = useState(false)

    const _onClose = useCallback(() => {
        onClose && onClose()
        dispatch(selectPost(null))
    }, [])

    const editHandle = () => {
        showNotificationComingSoon()
        ref.current.close()
    }
    const deleteHandle = async () => {
        ref.current.close()
        setProcessing(true)
        await dispatch(deletePost(selectedPost))
        setProcessing(false)
        showNotification('Post deleted successfully', () => <UtilIcons.success />, 'success')
    }
    const editAudienceHandle = () => {
        showNotificationComingSoon()
        ref.current.close()
    }
    const hideHandle = () => {
        showNotificationComingSoon()
        ref.current.close()
    }
    const reportHandle = () => {
        showNotificationComingSoon()
        ref.current.close()
    }

    return (
        <AppBottomSheet
            onClose={_onClose}
            // snapPoints={[isMyPost ? SIZES.height * 0.35 : SIZES.height * 0.25]}
            snapPoints={[SIZES.height * 0.35]}
            ref={ref}
            backgroundStyle={{ backgroundColor: COLORS.darkGrey }}
            handleIndicatorStyle={{backgroundColor: COLORS.lightGrey}}
        >
            <TextComponent text={"Post's Options"} style={{ ...FONTS.h3, textAlign: 'center' }} />
            <Divider height={0.3} color={COLORS.lightGrey} />
            {isMyPost ? (
                <>
                    <TouchableOpacity style={styles.item} onPress={editHandle}>
                        <UtilIcons.svgAlert color={COLORS.socialWhite} />
                        <TextComponent text={"Edit post"} style={{ ...FONTS.h3 }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.item} onPress={() => setShowAlert(true)}>
                        <UtilIcons.svgTrash />
                        <TextComponent text={"Delete post"} style={{ ...FONTS.h3 }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.item} onPress={editAudienceHandle}>
                        <UtilIcons.svgSettings color={COLORS.socialWhite} />
                        <TextComponent text={"Edit audience"} style={{ ...FONTS.h3 }} />
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <TouchableOpacity style={styles.item} onPress={hideHandle}>
                        <UtilIcons.svgHide color={COLORS.socialWhite} size={20} />
                        <TextComponent text={"Hide post"} style={{ ...FONTS.h3 }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.item} onPress={reportHandle}>
                        <UtilIcons.svgReport color={COLORS.socialWhite} size={20} />
                        <TextComponent text={"Report post"} style={{ ...FONTS.h3 }} />
                    </TouchableOpacity>
                </>
            )}
            <AlertV1
                title='Sure you want to delete post?'
                description=''
                visible={showAlert}
                onClose={() => setShowAlert(false)}
                onConfirm={deleteHandle}
            />
            <Loading visible={processing} />
        </AppBottomSheet>
    )
})

export default PostOptionBottomSheet

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