import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { ProfileScreen } from "../screens"

const Stack = createNativeStackNavigator()

const ProfileStack = ({ navigation }: any) => {
    return (
        <Stack.Navigator initialRouteName="Profile" screenOptions={{headerShadowVisible: false}}>
            <Stack.Screen
                name='Profile'
                component={ProfileScreen}
                options={{headerShown: false}}
            /> 
        </Stack.Navigator>
    )
}

export default ProfileStack