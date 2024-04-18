import storage from '@react-native-firebase/storage'

const useMedia = () => {

    const deleteMedia = async (uri: string) => {
        try {
            const storageRef = storage().refFromURL(uri)
            const mediaRef = storage().ref(storageRef.fullPath)

            await mediaRef.delete()
        } catch (error) {
            console.log("🚀 ~ file: HomeScreen.tsx:125 ~ deleteMedia ~ error:", error)
        }
    }

    return { deleteMedia }
}

export default useMedia