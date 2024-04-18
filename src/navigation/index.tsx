import { AuthProvider } from "./AuthProvider.android"
import Routes from "./Routes"

console.log(process.env.REACT_NATIVE_APP_BASE_URL)

const Providers = () => {
    return (
        <AuthProvider>
            <Routes />
        </AuthProvider>
    )
}

export default Providers