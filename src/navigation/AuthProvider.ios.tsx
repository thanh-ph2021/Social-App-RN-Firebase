import { Dispatch, ReactNode, SetStateAction, createContext, useState } from "react"
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { UserModel } from "../models"

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export interface AuthContextType {
    user: UserModel | null,
    setUser: Dispatch<SetStateAction<UserModel | null>>,
    login: (email: string, password: string) => Promise<void>
    googleLogin?: () => Promise<void>
    facebookLogin?: () => Promise<void>
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