import { Dispatch, ReactNode, SetStateAction, createContext, useState } from "react"
import auth from '@react-native-firebase/auth'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { LoginManager, AccessToken } from 'react-native-fbsdk-next'
import firestore from '@react-native-firebase/firestore'

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface UserModel {
    uid: string
}

export interface AuthContextType {
    user: UserModel | null,
    setUser: Dispatch<SetStateAction<UserModel | null>>,
    login: (email: string, password: string) => Promise<void>
    googleLogin: () => Promise<void>
    facebookLogin: () => Promise<void>
    register: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [user, setUser] = useState<UserModel | null>(null);

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            login: async (email: string, password: string) => {
                try {
                    await auth().signInWithEmailAndPassword(email, password)
                } catch (error) {
                    console.log('Error Login', error)
                }
            },
            googleLogin: async () => {
                try {
                    // Check if your device supports Google Play
                    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
                    // Get the users ID token
                    const { idToken } = await GoogleSignin.signIn();

                    // Create a Google credential with the token
                    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

                    // Sign-in the user with the credential
                    await auth().signInWithCredential(googleCredential);
                } catch (error) {
                    console.log('Google Login Error', error)
                }
            },
            facebookLogin: async () => {
                try {
                    // Attempt login with permissions
                    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

                    if (result.isCancelled) {
                        throw 'User cancelled the login process';
                    }

                    // Once signed in, get the users AccessToken
                    const data = await AccessToken.getCurrentAccessToken();

                    if (!data) {
                        throw 'Something went wrong obtaining access token';
                    }

                    // Create a Firebase credential with the AccessToken
                    const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

                    // Sign-in the user with the credential
                    await auth().signInWithCredential(facebookCredential);
                } catch (error) {
                    console.log('Facebook Login Error', error)
                }
            },
            register: async (email: string, password: string) => {
                try {
                    await auth().createUserWithEmailAndPassword(email, password)
                    .then(() => {
                        firestore().collection('users').doc(auth().currentUser!.uid)
                        .set({
                            fname: '',
                            lname: '',
                            email: email,
                            createAt: firestore.Timestamp.fromDate(new Date()),
                            userImg: null
                        })
                    })
                    .catch((error) => {
                        console.log('Something went wrong with added user to firestore', error)
                    })
                } catch (error) {
                    console.log('Error Register', error)
                }
            },
            logout: async () => {
                try {
                    await auth().signOut()
                } catch (error) {
                    console.log('Error Logout', error)
                }
            }
        }}>
            {children}
        </AuthContext.Provider>
    )
}