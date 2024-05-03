import { createNativeStackNavigator } from "@react-navigation/native-stack"

import HomeScreen from "../screens/HomeScreen"
import { ProfileScreen } from "../screens"

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
            
            
        </Stack.Navigator>
    )
}

export default FeedStack