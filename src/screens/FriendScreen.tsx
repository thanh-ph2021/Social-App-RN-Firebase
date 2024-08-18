import { SafeAreaView, StyleSheet, TouchableOpacity } from "react-native"
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { NativeStackScreenProps } from "@react-navigation/native-stack"

import { Header } from "../components"
import { utilStyles } from "../styles"
import { UtilIcons } from "../utils/icons"
import { COLORS, SIZES } from "../constants"
import { useAppSelector } from "../hooks"
import { UserModel } from "../models"
import FollowerScreen from "./FollowScreen"
import { selectUserByUID } from "../redux/selectors"

const Tab = createMaterialTopTabNavigator()

const FriendScreen = ({ navigation, route }: NativeStackScreenProps<any>) => {
    
    const params = route.params
    const user: UserModel = params && useAppSelector(state => selectUserByUID(state, params.uid))

    return (
        <SafeAreaView style={utilStyles.containerBackground}>
            <Header
                title={'Friends'}
                leftComponent={
                    <TouchableOpacity style={utilStyles.btnHeaderLeft} onPress={() => navigation.goBack()}>
                        <UtilIcons.svgArrowLeft color={COLORS.socialWhite} />
                    </TouchableOpacity>
                }
            />
            <Tab.Navigator
                screenOptions={{
                    tabBarStyle: { backgroundColor: COLORS.darkBlack },
                    tabBarLabelStyle: { color: COLORS.socialWhite, fontWeight: 'bold' }
                }}
                initialRouteName={params ? params.routeName : 'Follower'}
            >
                <Tab.Screen name="Follower">
                    {(props) => <FollowerScreen data={user.followers ?? []} {...props} />}
                </Tab.Screen>
                <Tab.Screen name="Following">
                    {(props) => <FollowerScreen data={user.followings ?? []} {...props} />}
                </Tab.Screen>
            </Tab.Navigator>
        </SafeAreaView>
    )
}

export default FriendScreen

const styles = StyleSheet.create({
    tag: {
        flex: 1,
        alignItems: 'center',
        padding: SIZES.base,
    },
    listItem: {
        gap: SIZES.padding
    }
})