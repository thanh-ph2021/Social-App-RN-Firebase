import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { useState } from 'react'

import { Loading } from '../Loader'
import AlertV1 from '../Alert/AlertV1'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { CommentModel, UserModel } from '../../models'
import Divider from '../Divider'
import { COLORS, FONTS, SIZES } from '../../constants'
import TextComponent from '../TextComponent'
import { UtilIcons } from '../../utils/icons'
import { showNotification, showNotificationComingSoon } from '../../utils'
import { deleteComment, updateComment } from '../../redux/actions/post'

interface Props {
    comment: CommentModel,
    postId: string,
    onClose?: () => void // close bottom sheet,
    parentData?: CommentModel,
    callback?: () => void
}

const CommentOption = ({ comment, onClose, postId, parentData, callback }: Props) => {

    const dispatch = useAppDispatch()
    const currentUser: UserModel = useAppSelector(state => state.userState.currentUser)
    const isMyPost = comment.userID === currentUser?.uid
    const [showAlert, setShowAlert] = useState(false)
    const [processing, setProcessing] = useState(false)

    const removeHandle = async () => {
        onClose && onClose()
        setProcessing(true)
        if(parentData && parentData.id !== comment.id){
            let oldComment = {...parentData}
            const newComment = {...oldComment, reply: oldComment.reply.filter(item => item.id !== comment.id)}
            await dispatch(updateComment(newComment, postId))
        } else {
            if(parentData && parentData.id === comment.id){
                callback && callback()
            }
            await dispatch(deleteComment(comment, postId))
        }
        setProcessing(false)
        showNotification('Comment deleted successfully', () => <UtilIcons.success />, 'success')
    }

    const editHandle = () => {
        showNotificationComingSoon()
        onClose && onClose()
    }
    const hideHandle = () => {
        showNotificationComingSoon()
        onClose && onClose()
    }
    const reportHandle = () => {
        showNotificationComingSoon()
        onClose && onClose()
    }

    return (
        <>
            <TextComponent text={"Comment's Options"} style={{ ...FONTS.h3, textAlign: 'center' }} />
            <Divider height={0.3} color={COLORS.lightGrey} />
            {isMyPost ? (
                <>
                    <TouchableOpacity style={styles.item} onPress={editHandle}>
                        <UtilIcons.svgAlert color={COLORS.socialWhite} />
                        <TextComponent text={"Edit comment"} style={{ ...FONTS.h3 }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.item} onPress={() => setShowAlert(true)}>
                        <UtilIcons.svgTrash />
                        <TextComponent text={"Remove comment"} style={{ ...FONTS.h3 }} />
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <TouchableOpacity style={styles.item} onPress={hideHandle}>
                        <UtilIcons.svgHide color={COLORS.socialWhite} size={20} />
                        <TextComponent text={"Hide comment"} style={{ ...FONTS.h3 }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.item} onPress={reportHandle}>
                        <UtilIcons.svgReport color={COLORS.socialWhite} size={20} />
                        <TextComponent text={"Report comment"} style={{ ...FONTS.h3 }} />
                    </TouchableOpacity>
                </>
            )}
            <AlertV1
                title='Sure you want to delete comment?'
                description=''
                visible={showAlert}
                onClose={() => setShowAlert(false)}
                onConfirm={removeHandle}
            />
            <Loading visible={processing} />
        </>
    )
}

export default CommentOption

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