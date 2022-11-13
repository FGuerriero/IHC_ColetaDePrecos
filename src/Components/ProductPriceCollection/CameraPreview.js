import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ImageBackground, DeviceEventEmitter } from 'react-native';

export default function CameraPreview(props) {
    const uriPhoto = props.photo.uri

    const handleRetake = () => {
        props.preview(false)
        props.setPhoto(null)
    }
    
    const handleSave = () => {
        props.preview(false)

        props.handlePreview()
    }

    useEffect(() => {
        return () => {
            DeviceEventEmitter.removeAllListeners("event.previewSave")
        }
    }, [])

    return (
        <View style={styles.container}>
            <ImageBackground 
                style={{flex: 1}} 
                source={{uri: uriPhoto}}
                imageStyle={{resizeMode: 'contain'}}
            >
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.save} onPress={handleSave}>
                        <Text style={styles.text}>Salvar Foto</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.reTake} onPress={handleRetake}>
                        <Text style={styles.text}>Tirar Novamente</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row-reverse',
        alignItems: 'flex-end'
    },
    text: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 18,
        textAlign: 'center'
    },
    save: {
        backgroundColor: 'lightgreen',
        flex: 1,
        justifyContent: 'center',
        height: 60
    },
    reTake: {
        backgroundColor: 'tomato',
        flex: 1,
        justifyContent: 'center',
        height: 60
    }
})