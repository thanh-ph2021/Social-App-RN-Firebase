import { Modal, StyleSheet, View, TouchableOpacity } from "react-native"

import { COLORS, FONTS, SIZES } from "../../constants"
import TextComponent from "../TextComponent"

interface Props {
    title: string,
    description: string,
    visible: boolean,
    onClose: () => void,
    onConfirm?: () => void,
    textButtonClose?: string,
    textButtonConfirm?: string,
}

const AlertV1 = (props: Props) => {

    const { title, description, visible, onClose, onConfirm, textButtonClose, textButtonConfirm } = props

    const renderButton = () => {

        if (onConfirm) {
            return (
                <View style={styles.containerButton}>
                    <TouchableOpacity
                        style={[styles.button]}
                        onPress={onClose}>
                        <TextComponent text={textButtonClose ? textButtonClose : 'No, cancel'} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: COLORS.socialBlue }]}
                        onPress={() => {
                            onConfirm()
                            onClose()
                        }}>
                        <TextComponent text={textButtonConfirm ? textButtonConfirm : 'Yes, confirm'} />
                    </TouchableOpacity>
                </View>
            )
        }

        return (
            <View style={styles.containerButton}>
                <TouchableOpacity
                    style={[styles.button]}
                    onPress={onClose} >
                    <TextComponent text={textButtonClose ? textButtonClose : 'Close'} />
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="fade"
                transparent={true}
                visible={visible}
                onRequestClose={onClose}>
                <View style={[styles.centeredView, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                    <View style={styles.modalView}>
                        <TextComponent text={title} style={[styles.modalText, { ...FONTS.h3 }]} />
                        {description && <TextComponent text={description} style={styles.modalText} color={COLORS.socialWhite} />}
                        {renderButton()}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

export default AlertV1

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalView: {
        margin: SIZES.base,
        backgroundColor: COLORS.lightGrey2,
        borderRadius: SIZES.base,
        width: '80%',
        padding: SIZES.padding,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },

    containerButton: {
        justifyContent: 'space-around',
        flexDirection: 'row',
        width: '100%',
        marginTop: SIZES.padding
    },

    button: {
        borderRadius: SIZES.base,
        padding: SIZES.base,
        elevation: 2,
        width: '40%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.socialBlue
    },

    buttonClose: {
        backgroundColor: COLORS.socialBlue,
    },

    modalText: {
        marginBottom: SIZES.padding,
        textAlign: 'center',
    },
});