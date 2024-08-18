import { memo, useState, useRef } from 'react'
import { TouchableOpacity, Text, View, Image, StyleSheet, Modal, ViewStyle } from "react-native"

import IconEmotionGroup from "./IconEmotionGroup"
import { utilStyles } from "../../styles"
import { COLORS, TypeEmotion, SIZES, images } from "../../constants"
import { UtilIcons } from '../../utils/icons'
import TextComponent from '../TextComponent'
import { LikeModel } from '../../models'

type LikeButtonProps = {
    data: LikeModel[],
    handleLike: (typeEmotion: string, isModal?: boolean) => Promise<void>,
    containerStyle?: ViewStyle
}

const EmotionIcons: { typeEmotion: string, image: any }[] = [
    {
        typeEmotion: TypeEmotion.Like,
        image: images.like
    },
    {
        typeEmotion: TypeEmotion.Love,
        image: images.love
    },
    {
        typeEmotion: TypeEmotion.Care,
        image: images.care
    },
    {
        typeEmotion: TypeEmotion.Haha,
        image: images.haha
    },
    {
        typeEmotion: TypeEmotion.Wow,
        image: images.wow
    },
    {
        typeEmotion: TypeEmotion.Sad,
        image: images.sad
    },
    {
        typeEmotion: TypeEmotion.Angry,
        image: images.angry
    },
]

const LikeButton = ({ data, handleLike, containerStyle }: LikeButtonProps) => {

    const [showModal, setShowModal] = useState<boolean>(false)
    const likeRef = useRef<any>(null)

    const renderModal = () => {
        const renderRow = (data: any[], style: any) => {
            return (
                <View style={style}>
                    {data.map((item, index) => (
                        <TouchableOpacity key={index} style={styles.iconItem} onPress={() => {
                            handleLike(item.typeEmotion, true)
                            setShowModal(false)
                        }}>
                            <Image source={item.image} style={styles.iconImage} />
                        </TouchableOpacity>
                    ))}
                </View>
            )
        }

        return (
            <Modal visible={showModal} transparent={true}>
                <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={() => setShowModal(false)}>
                    <View style={[styles.modalContent]}>
                        {renderRow(EmotionIcons.slice(0, 3), [styles.iconRow, { marginBottom: SIZES.padding, width: '80%' }])}
                        {renderRow(EmotionIcons.slice(3), styles.iconRow)}
                    </View>
                </TouchableOpacity>
            </Modal>
        )
    }

    return (
        <TouchableOpacity ref={likeRef} style={[utilStyles.button, containerStyle]} onPress={() => handleLike(TypeEmotion.Like)} onLongPress={() => setShowModal(true)}>
            {data && data.length > 0 ? (
                <IconEmotionGroup emotionData={data} />
            ) : (
                <UtilIcons.svgLike />
            )}
            <TextComponent text={`${data.length > 0 ? data.length : ''}`} style={{ paddingLeft: SIZES.padding }} />
            {renderModal()}
        </TouchableOpacity>
    )
}

export default memo(LikeButton)

const styles = StyleSheet.create({
    iconItem: {
        flex: 1,
        alignItems: 'center',
    },

    iconImage: {
        width: 40,
        height: 40,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        backgroundColor: COLORS.darkGrey,
        padding: SIZES.padding * 2,
        borderRadius: SIZES.base,
    },
    iconRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        columnGap: 10
    },
})