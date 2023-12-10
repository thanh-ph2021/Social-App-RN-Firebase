import { createNativeStackNavigator } from "@react-navigation/native-stack"
import HomeScreen from "../screens/HomeScreen"
import AddPostScreen from "../screens/AddPostScreen"
import Feather from 'react-native-vector-icons/Feather'
import { COLORS, SIZES, FONTS } from "../constants"
import { TouchableOpacity, Text } from 'react-native'
import { ChatScreen, MessagesScreen } from "../screens"

const Stack = createNativeStackNavigator()

const MessageStack = ({ navigation }: any) => {
    return (
        <Stack.Navigator initialRouteName="Messages" screenOptions={{headerShadowVisible: false}}>
            <Stack.Screen
                name='Messages'
                component={MessagesScreen}
            />
            <Stack.Screen
                name='Chat'
                component={ChatScreen}
                options={({route}: any) => ({
                    title: route!.params!.userID ?? '',
                    headerShadowVisible: false
                })}
            />
        </Stack.Navigator>
    )
}

export default MessageStack