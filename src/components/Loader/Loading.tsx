import { Modal, StyleSheet, View, ActivityIndicator } from "react-native"

import { COLORS, FONTS, SIZES } from "../../constants"
import TextComponent from "../TextComponent"


interface Props {
    title?: string,
    visible: boolean,
}

const Loading = (props: Props) => {

    const { title, visible } = props

    return (
        <View style={styles.centeredView}>
             <Modal visible={visible} transparent>
                <View style={{ backgroundColor: 'rgba(0,0,0,0.5)', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ width: 200, height: 100, backgroundColor: COLORS.lightGrey, borderRadius: SIZES.base, alignItems: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator size='large' color={COLORS.socialPink} />
                        <TextComponent style={{ ...FONTS.body3, padding: SIZES.base }} text={title ? title : 'Processing ...'}/>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

export default Loading

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    modalView: {
        margin: SIZES.base,
        backgroundColor: COLORS.darkGrey,
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