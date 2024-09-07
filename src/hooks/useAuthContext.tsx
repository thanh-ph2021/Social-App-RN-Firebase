import { useContext } from "react"
import { AuthContext, AuthContextType } from "../navigation/AuthProvider.android"


const useAuthContext = () => {
    const value = useContext(AuthContext)

    if (!value) {
        throw new Error("useAuthContext must be used within an AuthProvider")
    }

    const { user, setUser, register, login, googleLogin, facebookLogin, logout, sendPasswordResetEmail }: AuthContextType = value

    return {
        user, setUser, register, login, googleLogin, facebookLogin, logout, sendPasswordResetEmail
    }
}

export default useAuthContext