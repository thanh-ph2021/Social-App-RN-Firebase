import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { ProfileScreen, UpdateProfileScreen } from "../screens"

const Stack = createNativeStackNavigator()

const ProfileStack = ({ navigation }: any) => {
    return (
        <Stack.Navigator initialRouteName="Messages" screenOptions={{headerShadowVisible: false}}>
            <Stack.Screen
                name='Profile'
                component={ProfileScreen}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name='UpdateProfile'
                component={UpdateProfileScreen}
                options={{
                    title: 'Edit profile'
                }}
            />
        </Stack.Navigator>
    )
}

export default ProfileStack