import { createNativeStackNavigator } from "@react-navigation/native-stack"
import HomeScreen from "../screens/HomeScreen"
import AddPostScreen from "../screens/AddPostScreen"
import Feather from 'react-native-vector-icons/Feather'
import { COLORS, SIZES, FONTS } from "../constants"
import { TouchableOpacity, Text } from 'react-native'
import { ChatScreen, ProfileScreen } from "../screens"

const Stack = createNativeStackNavigator()

const FeedStack = ({ navigation }: any) => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name='Feed'
                component={HomeScreen}
                options={{
                    title: 'Social',
                    headerTitleAlign: 'center',
                    headerTitleStyle: {
                        color: COLORS.blue,
                        fontWeight: 'bold'
                    },
                    headerShadowVisible: false,
                    headerRight: () => {
                        return (
                            <TouchableOpacity onPress={() => navigation.navigate('AddPost')}>
                                <Feather name='plus' color={COLORS.blue} size={SIZES.icon} />
                            </TouchableOpacity>
                        )
                    }
                }}
            />
            <Stack.Screen
                name='AddPost'
                component={AddPostScreen}
                options={{
                    title: '',
                    headerTitleAlign: 'center',
                    headerTitleStyle: {
                        color: COLORS.blue,
                        fontWeight: 'bold'
                    },
                    headerShadowVisible: false,
                    headerLeft: () => {
                        return (
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Feather name='arrow-left' color={COLORS.blue} size={SIZES.icon} />
                            </TouchableOpacity>
                        )
                    },
                }}
            />
            <Stack.Screen name='Profile' component={ProfileScreen} options={{headerShown: false}}/>
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

export default FeedStack