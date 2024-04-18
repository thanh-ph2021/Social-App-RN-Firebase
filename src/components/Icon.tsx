import AntDesign from "react-native-vector-icons/AntDesign"
import Entypo from "react-native-vector-icons/Entypo"
import EvilIcons from "react-native-vector-icons/EvilIcons"
import Feather from "react-native-vector-icons/Feather"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"
import Fontisto from "react-native-vector-icons/Fontisto"
import Foundation from "react-native-vector-icons/Foundation"
import Ionicons from "react-native-vector-icons/Ionicons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import Octicons from "react-native-vector-icons/Octicons"
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"
import Zocial from "react-native-vector-icons/Zocial"

export enum TypeIcons {
    AntDesign = 'AntDesign',
    Entypo = 'Entypo',
    EvilIcons = 'EvilIcons',
    Feather = 'Feather',
    FontAwesome = 'FontAwesome',
    FontAwesome5 = 'FontAwesome5',
    Fontisto = 'Fontisto',
    Foundation = 'Foundation',
    Ionicons = 'Ionicons',
    MaterialCommunityIcons = 'MaterialCommunityIcons',
    MaterialIcons = 'MaterialIcons',
    Octicons = 'Octicons',
    SimpleLineIcons = 'SimpleLineIcons',
    Zocial = 'Zocial',
  }

type IconProps = {
    type: TypeIcons,
    name: string,
    color: string,
    size: number,
    style?: any,
}

const Icon = ({ type, name, color, size, style }: IconProps) => {
    switch (type) {
        case 'AntDesign':
            return <AntDesign name={name} color={color} size={size} style={style} />
        case 'Entypo':
            return <Entypo name={name} color={color} size={size} style={style} />
        case 'EvilIcons':
            return <EvilIcons name={name} color={color} size={size} style={style} />
        case 'Feather':
            return <Feather name={name} color={color} size={size} style={style} />
        case 'FontAwesome':
            return <FontAwesome name={name} color={color} size={size} style={style} />
        case 'FontAwesome5':
            return <FontAwesome5 name={name} color={color} size={size} style={style} />
        case 'Fontisto':
            return <Fontisto name={name} color={color} size={size} style={style} />
        case 'Foundation':
            return <Foundation name={name} color={color} size={size} style={style} />
        case 'Ionicons':
            return <Ionicons name={name} color={color} size={size} style={style} />
        case 'MaterialCommunityIcons':
            return <MaterialCommunityIcons name={name} color={color} size={size} style={style} />
        case 'MaterialIcons':
            return <MaterialIcons name={name} color={color} size={size} style={style} />
        case 'Octicons':
            return <Octicons name={name} color={color} size={size} style={style} />
        case 'SimpleLineIcons':
            return <SimpleLineIcons name={name} color={color} size={size} style={style} />
        case 'Zocial':
            return <Zocial name={name} color={color} size={size} style={style} />
    }
}

export default Icon