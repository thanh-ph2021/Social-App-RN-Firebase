import { useEffect, useState } from 'react'
import { View, TextInput, TouchableOpacity, Text, Platform, Image, Alert, ActivityIndicator } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { styles } from '../styles'
import { FONTS, SIZES, COLORS } from '../constants'
import ActionButton from 'react-native-action-button'
import Icon from 'react-native-vector-icons/Ionicons'
import ImagePicker from 'react-native-image-crop-picker'
import storage from '@react-native-firebase/storage'
import firestore from '@react-native-firebase/firestore'
import useAuthContext from '../hooks/useAuthContext'

const AddPostScreen = ({ navigation }: NativeStackScreenProps<any>) => {

    const [text, setText] = useState('')
    const [image, setImage] = useState<any>(null)
    const [upLoading, setUpLoading] = useState<any>()
    const [transferred, setTransferred] = useState<any>()
    const { user } = useAuthContext()

    const submitPost = async () => {
        const imageUrl = await uploadImage()

        await firestore()
            .collection('Posts')
            .add({
                userID: user!.uid,
                post: text,
                postImg: imageUrl,
                postTime: firestore.Timestamp.fromDate(new Date()),
                likes: null,
                comments: null
            })
            .then(() => {
                console.log('User added!');
                setImage(null)
                setText('')
                Alert.alert('Post published!', 'Your post has been published Successfully!')
            })
            .catch((error) => {
                console.log('Something went wrong with added post to firestore.', error)
            });
    }

    const uploadImage = async () => {
        if(image == null){
            return null
        }

        const uploadUri = image
        let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1)

        const storageRef = storage().ref(`photos/${filename}`)
        const task = storageRef.putFile(uploadUri)

        // tiến trình đăng ảnh
        task.on('state_changed', taskSnapshot => {
            setTransferred(Math.floor(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes * 100))
        });

        try {
            setUpLoading(true)
            await task

            // url image in firebase
            const url = await storageRef.getDownloadURL()

            setUpLoading(false)
            return url;
        } catch (error) {
            console.log('Upload image to firebase error', error)
            return null
        }
    }

    const handleTakePhoto = () => {
        ImagePicker.openCamera({
            width: 1200,
            height: 780,
            cropping: true,
        }).then(image => {
            const imageUri = Platform.OS == 'ios' ? image.sourceURL : image.path
            setImage(imageUri)
        });
    }

    const handleChoosePhoto = () => {
        ImagePicker.openPicker({
            width: 1200,
            height: 780,
            cropping: true
        }).then(image => {
            const imageUri = Platform.OS == 'ios' ? image.sourceURL : image.path
            setImage(imageUri)
        });
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', padding: SIZES.padding }}>
            {image && <Image source={{ uri: image }} style={{ width: '100%', height: 250, borderRadius: SIZES.base }} />}

            <TextInput
                multiline
                value={text}
                onChangeText={setText}
                numberOfLines={4}
                placeholder="What 's on your mind?"
                style={{ ...FONTS.body3, padding: SIZES.padding, marginTop: SIZES.padding }}
            />

            {upLoading ? (
                <View>
                    <Text>{transferred} %</Text>
                    <ActivityIndicator color={COLORS.blue} size='small' />
                </View>
            ) : (
                <TouchableOpacity onPress={() => submitPost()}>
                    <Text style={{ ...FONTS.body3, color: COLORS.blue, fontWeight: 'bold' }}>Post</Text>
                </TouchableOpacity>
            )}

            {/* Rest of the app comes ABOVE the action button component !*/}
            <ActionButton buttonColor="rgba(231,76,60,1)" style={{ bottom: 60, right: -SIZES.padding }}>
                <ActionButton.Item buttonColor='#9b59b6' title="Take Photo" onPress={() => handleTakePhoto()}>
                    <Icon name="camera-outline" style={styles.actionButtonIcon} />
                </ActionButton.Item>
                <ActionButton.Item buttonColor='#3498db' title="Choose Photo" onPress={() => handleChoosePhoto()}>
                    <Icon name="images-outline" style={styles.actionButtonIcon} />
                </ActionButton.Item>
            </ActionButton>
        </View>
    )
}

export default AddPostScreen