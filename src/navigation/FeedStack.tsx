import { createNativeStackNavigator } from "@react-navigation/native-stack"
import HomeScreen from "../screens/HomeScreen"
import AddPostScreen from "../screens/AddPostScreen"
import Feather from 'react-native-vector-icons/Feather'
import { COLORS, SIZES, FONTS } from "../constants"
import { TouchableOpacity, Text, View } from 'react-native'
import { ChatScreen, ImageViewScreen, ProfileScreen } from "../screens"
import { Icon, TypeIcons } from "../components"

const Stack = createNativeStackNavigator()

const FeedStack = ({ navigation }: any) => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name='Feed'
                component={HomeScreen}
                options={{headerShown: false}}
            // options={{
            //     title: 'LaCons Social',
            //     headerTitleAlign: 'left',
            //     headerTitleStyle: {
            //         color: COLORS.blue,
            //         fontWeight: 'bold'
            //     }, 
            //     headerShadowVisible: false,
            //     headerRight: () => {
            //         return (
            //             <View style={{ flexDirection: 'row' }}>
            //                 <TouchableOpacity style={{paddingRight: SIZES.padding}} onPress={() => { }}>
            //                     <Icon type={TypeIcons.Ionicons} name='search' color={COLORS.gray} size={SIZES.icon} />
            //                 </TouchableOpacity>
            //                 <TouchableOpacity
            //                     onPress={() => navigation.navigate('AddPost')}>
            //                     <Icon type={TypeIcons.MaterialIcons} name='add-circle-outline' color={COLORS.blue} size={SIZES.icon} />
            //                 </TouchableOpacity>
            //             </View>
            //         )
            //     }
            // }}
            />
            <Stack.Screen name='Profile' component={ProfileScreen} options={{ headerShown: false }} />
            <Stack.Screen
                name='Chat'
                component={ChatScreen}
                options={({ route }: any) => ({
                    title: route!.params!.userID ?? '',
                    headerShadowVisible: false
                })}
            />
        </Stack.Navigator>
    )
}

export default FeedStack