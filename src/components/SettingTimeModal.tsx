import { Modal, StyleSheet, TouchableOpacity, View } from "react-native"
import { useState } from "react"
import { Picker } from "react-native-wheel-pick"

import TextComponent from "./TextComponent"
import { COLORS, FONTS, SIZES } from "../constants"

interface Props {
    onConfirm: (day: string, time: string, minute: string) => void,
    onCancel: () => void,
    open: boolean,
}

const SettingTimeModal = (props: Props) => {

    const { onConfirm, onCancel, open } = props
    const [day, setDay] = useState('0')
    const [hour, setHour] = useState('0')
    const [minute, setMinute] = useState('0')

    const daysList = Array.from({ length: 8 }, (_, i) => i.toString())
    const hoursList = Array.from({ length: 24 }, (_, i) => i.toString())
    const minutesList = Array.from({ length: 60 }, (_, i) => i.toString())

    return (
        <Modal visible={open} transparent>
            <View style={styles.centeredView}>
                <View style={styles.modalContent}>
                    <TextComponent text='Setting Time' style={{ ...FONTS.h3 }} />
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <View style={{ width: '30%', alignItems: 'center' }}>
                            <TextComponent text={'Day'} />
                            <Picker
                                style={styles.picker}
                                selectLineColor='black'
                                textColor={COLORS.socialWhite}
                                selectedValue='0'
                                textSize={SIZES.body3}
                                pickerData={daysList}
                                onValueChange={(value: any) => { setDay(value) }}
                            />
                        </View>
                        <View style={{ width: '30%', alignItems: 'center' }}>
                            <TextComponent text={'Hour'} />
                            <Picker
                                style={styles.picker}
                                selectLineColor='black'
                                textColor={COLORS.socialWhite}
                                textSize={SIZES.body3}
                                selectedValue='0'
                                pickerData={hoursList}
                                onValueChange={(value: any) => { setHour(value) }}
                            />
                        </View>
                        <View style={{ width: '30%', alignItems: 'center' }}>
                            <TextComponent text={'Minute'} />
                            <Picker
                                style={styles.picker}
                                textColor={COLORS.socialWhite}
                                textSize={SIZES.body3}
                                selectLineColor='black'
                                selectedValue='0'
                                pickerData={minutesList}
                                onValueChange={(value: any) => { setMinute(value) }}
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <TouchableOpacity onPress={onCancel}>
                            <TextComponent text='CANCEL' color={COLORS.socialBlue} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onConfirm(day, hour, minute)} style={styles.button}>
                            <TextComponent text='SET' color={COLORS.socialBlue} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default SettingTimeModal

const styles = StyleSheet.create({
    picker: {
        width: '100%',
        backgroundColor: COLORS.darkGrey,
    },

    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalContent: {
        backgroundColor: COLORS.darkGrey,
        padding: SIZES.padding,
        borderRadius: 10,
        gap: SIZES.padding,
        width: '80%',
    },

    button: {
        paddingLeft: SIZES.padding * 2,
    }
})