import React, { useState, useEffect } from 'react';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import { SafeAreaView, Text, StyleSheet, TouchableOpacity, Alert, View, ImageBackground, Image, TextInput, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker'
import TakePic from './TakePic';
import BodyAreas from '../SkinAnalysisRequest/BodyAreas';
import {human} from './ImageMapper/human.ts';
import { AntDesign } from '@expo/vector-icons';

export default function SendPic(props) {
    const [startCamera, setStartCamera] = useState(false)
    const [photo, setPhoto] = useState(null)
    const [bodyAreaSelection, setBodyAreaSelection] = useState(false)
    const [selectedBodyArea, setSelectedBodyArea] = useState(0)
    const [selectedDisease, setSelectedDisease] = useState("notSelected")
    const [location, setLocation] = useState(null)
    const [locationErrorMsg, setLocationErrorMsg] = useState(null)
    const [comments, setComments] = useState(null)
    const [loading, setLoading] = useState(false)
    
    const __startCamera = async () =>{
        const {status} = await Camera.requestCameraPermissionsAsync()

        if(status === 'granted'){
            setStartCamera(true)
        }else{
            Alert.alert("Access denied!")
        }
    }
    
    //Reload Hook
    useEffect(async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted' && photo === null) {
            setLocationErrorMsg('Permission to access location was denied');
            console.log('GPS location: ', locationErrorMsg)
            return;
        }

        let myLocation = await Location.getCurrentPositionAsync({})
        setLocation(myLocation)

        //Log for Debugging
        console.log('GPS location: ', location )
        console.log('Photo: ', photo)
    },[])
    
    const sendInformation = async () => {
        //Check if Body Area is selected
        if( selectedBodyArea === 0 ){
            Alert.alert("Please, select Body Area before submit request.")
            return
        } else if(selectedDisease === 'notSelected'){
            Alert.alert("Please, select Disease before submit request.")
            return
        }

        setLoading(true)
        
        //Enviando solicitação para API
        const formData = new FormData()
        formData.append("img_file", { uri: photo.uri , name: 'image.png', type: 'image/png' })
        formData.append('body_area', human[selectedBodyArea].value)
        formData.append('comment', comments)
        formData.append('location', "Latitude: " + location.coords.latitude + ", Longitude: " +  location.coords.longitude)
        formData.append('request_date', new Date().toISOString().split('T')[0])
        formData.append('disease', selectedDisease)
        
        fetch('https://0e62-187-32-187-251.sa.ngrok.io/uploadimage', {
                method: "POST",
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                body: formData
        }).then( response => {
            console.log("Status: ", response.status)
            return response.json()
        })
        .then( data => {
            console.log('Response: ', data)
            
            Alert.alert(data.msg)
            //props.handleNewPic(false)
        }).catch(err => {
            console.log("Error: ", err)
        }).finally(() => {
            setLoading(false)
        })

    }    

    return (
        <SafeAreaView style={styles.container}>
            {startCamera ? 
                <TakePic handleCamState={setStartCamera} photoMini={setPhoto}/> : 
                    bodyAreaSelection ? 
                    <BodyAreas handleBodyArea={setBodyAreaSelection} handleSelection={setSelectedBodyArea}/>:(
                <View style={styles.subContainer}>
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.backButton} onPress={() => props.handleNewPic(false)}>
                            <AntDesign name="leftcircle" size={40} color='#3cbfad' />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.body}>
                        <ImageBackground style={styles.miniImg} source={require('../../../assets/camera.png')} imageStyle={{resizeMode: 'contain'}}>
                            {photo ? <Image source={{uri: photo.uri}} style={styles.photo} resizeMode='center'/> : <View/>}
                        </ImageBackground>
                        <TouchableOpacity style={styles.takePicButton} onPress={__startCamera}>
                            <Text style={styles.textPicButton}>{!!photo ? "Retake Picture" : "Take a picture"}</Text>
                        </TouchableOpacity>

                        <View style={styles.containerSelectBodyAreas}>
                            <TouchableOpacity style={styles.btnSelectBodyAreas} onPress={() => setBodyAreaSelection(true)}>
                                <Text style={styles.txtSelectBodyArea}>Select Body Area</Text>
                            </TouchableOpacity>
                            <Image style={styles.photoBodyArea} source={human[selectedBodyArea].avatar}/>
                        </View>

                        <Picker
                            style={styles.picker}
                            selectedValue={selectedDisease}
                            enabled={!!photo}
                            onValueChange={newValue => setSelectedDisease(newValue)}
                        >
                            <Picker.Item label='Select Disease' value='notSelected' key={0}/>
                            <Picker.Item label='Healthy' value='healthy' key={1}/>
                            <Picker.Item label='To be Defined' value='toBeDefined' key={2}/>
                            <Picker.Item label='2' value='2' key={3}/>
                            <Picker.Item label='3' value='3' key={4}/>
                            <Picker.Item label='4' value='4' key={5}/>
                        </Picker>
                        
                        <View style={styles.textFieldContainer}>
                            <Text style={styles.label}> Comments: </Text>
                            <TextInput
                                style={styles.input}
                                placeholder={'Example: moderate itching, redness after sun exposure, etc...'}
                                onChangeText={newText => setComments(newText)}
                            />
                        </View>
                    </View>

                    {
                        loading?
                        <ActivityIndicator animating={loading} size="large" color="#3cbfad"/>:
                        <View/>
                    }

                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.submitBtn} onPress={ sendInformation }>
                            <Text style={styles.btnText}>SUBMIT</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center'
    },
    subContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20
    },
    header: {
        height: 50
    },
    body: {
        flex: .8,
        justifyContent: 'flex-start',
    },
    footer: {
        height: 40
    },
    submitBtn: {
        flex: 1,
        backgroundColor: '#3cbfad',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5
    },
    miniImg: {
        flex: .7,
        backgroundColor: '#80808047',
        width: 140,
        alignSelf: 'center',
        marginBottom: 5,
        marginTop: 10
    },
    takePicButton: {
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: '#3cbfadc5',
        elevation: 5,
        width: 220,
        height: 35,
        borderWidth: .01,
        borderRadius: 40
    },
    textPicButton: {
        justifyContent: 'center',
        fontSize: 18,
        color: 'white'
    },
    photo: {
        flex: 1,
        backgroundColor: 'transparent',
        borderWidth: 3,
        borderColor: '#3cbfad87'
    },
    logo: {
        flex: 1,
        backgroundColor: 'white',
        width: 150
    },
    textFieldContainer: {
        height: 100,
        backgroundColor: '#fffb',
        marginVertical: 5,
        borderWidth: 1,
        alignItems:'center',
        padding: 5
    },
    label: {
        flex: 1,
        fontSize: 20
    },
    input: {
        flex: 1,
        fontSize: 15
    },
    picker: {
        height: 60
    },
    map: {
        flex: .2,
        width: 200
    },
    btnText: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold'
    }, 
    containerSelectBodyAreas: {
        flex: .1,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        marginVertical: 15,
        paddingHorizontal: 5
    },
    btnSelectBodyAreas: {
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: .01,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: '#3cbfad87',
        height: 30
    },
    photoBodyArea: {
        backgroundColor: '#80808047',
        height: 60,
        width: 50
    },
    txtSelectBodyArea: {
        color: 'black',
        fontSize: 15,
        marginHorizontal: 20
    },
    backButton: {
        alignSelf: 'flex-start'
    }
})