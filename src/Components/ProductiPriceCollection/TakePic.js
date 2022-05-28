import React, { useState, useEffect } from 'react';
import { Camera } from 'expo-camera';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import CameraPreview from './CameraPreview';

export default function TakePic(props) {
    const [previewVisible, setPreviewVisble] = useState(false)
    const [capturedImage, setCapturedImage] = useState(null)
    const [camRatio, setCamRatio] = useState('4:3')

    let camera 

    const __takePicture = async () => {
        if(!camera) return
        const photo = await camera.takePictureAsync()
        setPreviewVisble(true)
        setCapturedImage(photo)
    }

    const handleExitCam = () => {
        props.handleCamState(false)
    }

    const setRatio = async () => {
        const suportedRatios = await camera.getSupportedRatiosAsync()
        setCamRatio(suportedRatios[suportedRatios.length - 1])
    }

    useEffect(() => {
        if(capturedImage && !previewVisible) {
            props.handleCamState(false)
            props.photoMini(capturedImage)
        }
    })
    
    return (
        <View style={styles.container}>
            { previewVisible && capturedImage ? (
                <CameraPreview 
                    style={styles.container} 
                    photo={capturedImage}
                    setPhoto={setCapturedImage}
                    preview={setPreviewVisble}
                />
            ) : (
                <Camera 
                    style={styles.camera} 
                    ref={(r) => {
                        camera = r
                    }}
                    type={Camera.Constants.Type.back}
                    ratio={camRatio}
                    onCameraReady={setRatio}
                >
                    <View style={styles.buttonContainer}>

                        <TouchableOpacity 
                        style={styles.captureButton}
                        onPress={__takePicture}
                        />
                        
                        <TouchableOpacity style={styles.backButton} onPress={handleExitCam}>
                            <AntDesign name="leftcircle" size={40} color="white" />
                        </TouchableOpacity>

                    </View>
                </Camera>
            )
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    camera: {
        flex: 1,
        justifyContent: 'center'
    },
    buttonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'column-reverse',
        justifyContent: 'space-between',
        margin: 20,
        alignItems: 'center'
    },
    captureButton: {
        width: 90,
        height: 90,
        backgroundColor: '#fff',
        borderRadius: 50,
        borderColor: '#fff8',
        borderWidth: 10
    },
    backButton: {
        alignSelf: 'flex-start',
        marginTop: 40
    }
})