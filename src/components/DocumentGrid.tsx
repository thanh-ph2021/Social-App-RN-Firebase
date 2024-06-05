import { memo } from 'react'
import { FlatList, Linking, ListRenderItem, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native'

import { UtilIcons } from '../utils/icons'
import { DocumentItem } from '../models/DocumentItem'
import TextComponent from './TextComponent'
import Icon, { TypeIcons } from './Icon'
import { COLORS, SIZES } from '../constants'
import { readableFileSize } from '../utils'

interface DocumentGridProps {
    documentArray: DocumentItem[]
    delDocument?: (name: string) => void,
    containerStyle?: StyleProp<ViewStyle>
}

const DocumentGrid = (props: DocumentGridProps) => {

    const { documentArray, delDocument, containerStyle } = props

    const renderItem: ListRenderItem<DocumentItem> = ({ item }) => {

        const renderIconTypeFile = () => {
            if (item.type) {
                if (item.type.includes('pdf')) {
                    return <UtilIcons.svgFileTypePDF size={30} />
                } else if (item.type.includes('msword')) {
                    return <UtilIcons.svgFileTypeDOC size={30} />
                } else if (item.type.includes('wordprocessingml')) {
                    return <UtilIcons.svgFileTypeDOCX size={30} />
                }
            }

            return <></>
        }

        return (
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => item.url && Linking.openURL(item.url)}>
                <View style={{ paddingRight: SIZES.base }}>
                    {renderIconTypeFile()}
                </View>

                <View style={{ width: '70%' }}>
                    <TextComponent text={item.name ?? ''} />
                    <TextComponent text={readableFileSize(item.size)} color={COLORS.lightGrey} />
                </View>
                {delDocument && <TouchableOpacity
                    style={{ padding: SIZES.base, alignItems: 'flex-end', flex: 1 }}
                    onPress={() => item.name != null && delDocument(item.name)}
                >
                    <Icon type={TypeIcons.Feather} name='x' size={SIZES.icon} color={COLORS.socialWhite} />
                </TouchableOpacity>}
            </TouchableOpacity>
        )
    }

    return (
        <FlatList
            data={documentArray}
            renderItem={renderItem}
            keyExtractor={(item, index) => item.name ? item.name : '' + index}
            scrollEnabled={false}
            contentContainerStyle={[{ padding: SIZES.padding }, containerStyle]}
        />
    )
}

export default memo(DocumentGrid)