import { NativeModules, View, Alert, Button, StyleSheet, Image, Platform } from 'react-native'
import { TextComponent } from '../components'
import { utilStyles } from '../styles'
import { useState } from 'react'
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions'
import ImagePicker from 'react-native-image-crop-picker'

const { ImageEditorModule } = NativeModules

const AddStoryScreen = () => {

    const [selectedImage, setSelectedImage] = useState<string>()
    const [editedImage, setEditedImage] = useState<string>()

    const requestPermissions = async () => {
        const cameraPermission = await request(
            PERMISSIONS.ANDROID.CAMERA
        );
        const storagePermission = await request(
            PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
        );
        return cameraPermission === RESULTS.GRANTED && storagePermission === RESULTS.GRANTED;
    };

    const pickImage = () => {
        const options = {
            title: 'Chọn ảnh',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        ImagePicker.openPicker({
            width: 1200,
            height: 780,
            multiple: true,
            mediaType: 'any'
        }).then(medias => {
            const mediasClone = [...medias]
            const media = medias[0]
            const uri = Platform.OS == 'ios' ? media.sourceURL : media.path
            setSelectedImage(uri)
        })
    };

    const openPhotoEditor = async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) {
            Alert.alert('Lỗi', 'Cần quyền truy cập để chỉnh sửa ảnh');
            return;
        }

        if (!selectedImage) {
            Alert.alert('Lỗi', 'Vui lòng chọn một ảnh trước');
            return;
        }
        
        console.log("🚀 ~ openPhotoEditor ~ selectedImage:", selectedImage)

        ImageEditorModule.openPhotoEditor(selectedImage)
            .then((editedImagePath: string) => {
                setEditedImage('file://' + editedImagePath);
            })
            .catch((error: any) => {
                console.log(error);
                Alert.alert('Lỗi', 'Không thể chỉnh sửa ảnh');
            });
    };

    return (
        <View style={styles.container}>
            <Button title="Chọn Ảnh" onPress={pickImage} />
            {selectedImage && (
                <Image source={{ uri: selectedImage }} style={styles.image} />
            )}
            <Button title="Chỉnh sửa Ảnh" onPress={openPhotoEditor} />
            {editedImage && (
                <Image source={{ uri: editedImage }} style={styles.image} />
            )}
        </View>
    );
}

export default AddStoryScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 250,
        height: 250,
        marginVertical: 16,
        resizeMode: 'contain',
    },
});