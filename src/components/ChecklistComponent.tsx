import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { useState } from 'react'
import { TextInput } from 'react-native'

import Icon, { TypeIcons } from './Icon'
import { COLORS, SIZES } from '../constants'
import TextComponent from "./TextComponent"
import { UtilIcons } from '../utils/icons'
import SettingTimeModal from './SettingTimeModal'
import { ChecklistModel, OptionDataModel, TimeLimitModel } from '../models'

const WIDTH = '90%'

interface ChecklistComponentProps {
    data: ChecklistModel,
    addOption: () => void,
    setValueOption: (id: string, value: string) => void,
    setTimeLimit: (value: TimeLimitModel) => void,
    removeOption?: (index: number) => void,
    invisible: () => void
}

const ChecklistComponent = (props: ChecklistComponentProps) => {

    const { data, addOption, setValueOption, removeOption, invisible, setTimeLimit } = props
    const [open, setOpen] = useState(false)

    const onConfirm = (day: string, hour: string, minute: string) => {
        setTimeLimit({ day, hour, minute })
        setOpen(false)
    }

    const renderOption = () => {

        return (
            data.optionDatas.map((item: OptionDataModel, index: number) => (
                <View style={styles.containerInput} key={item.id + index}>
                    <TextInput
                        placeholder={`option ${index + 1}`}
                        placeholderTextColor={COLORS.lightGrey}
                        value={item.title}
                        onChangeText={(value) => setValueOption(item.id, value)}
                        style={{ color: COLORS.white, flex: 1 }}
                    />
                </View>
            ))
        )
    }
    return (
        <View style={styles.container}>
            <View style={styles.containerOption}>
                <View style={{ flex: 1 }}>
                    {renderOption()}
                </View>
                <View style={{ gap: SIZES.base }}>
                    <TouchableOpacity
                        style={styles.buttonAdd}
                        onPress={invisible}
                    >
                        <Icon type={TypeIcons.Feather} name='x' size={SIZES.icon} color={'red'} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buttonAdd}
                        onPress={addOption}
                    >
                        <UtilIcons.svgPlus />
                    </TouchableOpacity>
                </View>

            </View>

            <TouchableOpacity
                style={styles.timeSelect}
                onPress={() => setOpen(true)}
            >
                <TextComponent text={'Poll length'} />
                <TextComponent text={`${data.timeLimit.day} day, ${data.timeLimit.hour} hour, ${data.timeLimit.minute} minute`} color={COLORS.socialBlue} />
            </TouchableOpacity>
            <SettingTimeModal
                onConfirm={onConfirm}
                onCancel={() => setOpen(false)}
                open={open}
            />
        </View>
    )
}

export default ChecklistComponent

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: SIZES.base,
        alignItems: 'flex-end'
    },

    containerOption: {
        padding: SIZES.base,
        borderRadius: SIZES.padding,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderWidth: 1,
        borderColor: COLORS.lightGrey,
        width: WIDTH,
        flexDirection: 'row',
        gap: SIZES.base
    },

    containerInput: {
        backgroundColor: COLORS.darkGrey,
        borderRadius: SIZES.base,
        paddingHorizontal: SIZES.padding,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: SIZES.padding,
    },

    buttonAdd: {
        backgroundColor: COLORS.darkGrey,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        borderRadius: SIZES.base
    },

    timeSelect: {
        marginBottom: SIZES.base,
        padding: SIZES.base,
        borderWidth: 1,
        borderTopWidth: 0,
        borderColor: COLORS.lightGrey,
        borderRadius: SIZES.padding,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        width: WIDTH,
    },
})

