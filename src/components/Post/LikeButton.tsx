import { memo, useState, useRef } from 'react'
import { TouchableOpacity, Text, View, Image, StyleSheet, Modal } from "react-native"

import IconEmotionGroup from "./IconEmotionGroup"
import Icon, { TypeIcons } from "../Icon"
import { utilStyles } from "../../styles"
import { COLORS, TypeEmotion, SIZES, images } from "../../constants"
import { LikeModel } from '../../models'
import { useAuthContext } from '../../hooks'
import { UtilIcons } from '../../utils/icons'

type LikeButtonProps = {
    data: string[],
    handleLike: (typeEmotion: string, isModal?: boolean) => Promise<void>
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

const LikeButton = ({ data, handleLike }: LikeButtonProps) => {

    // console.log('abc')

    const [showModal, setShowModal] = useState<boolean>(false)
    const [positionModal, setPositionModal] = useState<number>(0)
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
                    <View style={[styles.modalContent, { position: 'absolute', top: positionModal }]}>
                        {renderRow(EmotionIcons.slice(0, 3), [styles.iconRow, { marginBottom: SIZES.padding, width: '80%' }])}
                        {renderRow(EmotionIcons.slice(3), styles.iconRow)}
                    </View>
                </TouchableOpacity>
            </Modal>
        )
    }

    const handleLongPressLike = () => {
        if (likeRef.current) {
            likeRef.current.measure((x: any, y: any, width: any, height: any, pageX: any, pageY: number) => {
                setPositionModal(pageY < 230 ? pageY + 30 : pageY - 180)
            });
        }
        setShowModal(true)
    }

    return (
        <TouchableOpacity ref={likeRef} style={utilStyles.button} onPress={() => handleLike(TypeEmotion.Like)} onLongPress={handleLongPressLike}>
            {data && data.length > 0 ? (
                <IconEmotionGroup emotionData={data} />
            ) : (
                <UtilIcons.svgLike />
            )}
            <Text style={[utilStyles.buttonText, { color: COLORS.socialWhite, paddingLeft: SIZES.base }]}>{data.length > 0 ? data.length : ''}</Text>
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
        width: 300,
        height: 150,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    iconRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        columnGap: 10
    },
})