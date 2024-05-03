import { StyleSheet, View, ViewStyle } from "react-native"

import TextComponent from "./TextComponent"
import { SIZES } from "../constants"

interface Props {
    title: string,
    centerComponent?: any,
    leftComponent?: any,
    rightComponent?: any,
    containerStyle?: ViewStyle
}

const Header = (props: Props) => {

    const { title, leftComponent, rightComponent, centerComponent, containerStyle } = props
    return (
        <View style={[styles.container, containerStyle]}>
            <View style={styles.btnLeftRightStyle} >
                {leftComponent}
            </View>
            {centerComponent ? centerComponent : <TextComponent text={title.toUpperCase()} style={styles.title} title={true} />}
            <View style={[styles.btnLeftRightStyle, { alignItems: 'flex-end' }]} >
                {rightComponent}
            </View>

        </View>
    )
}

export default Header

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: SIZES.base,
        marginBottom: SIZES.padding + SIZES.base,
    },

    title: {
        textAlign: 'center',
        fontWeight: 'bold'
    },

    btnLeftRightStyle: {
        width: '20%'
    }
})