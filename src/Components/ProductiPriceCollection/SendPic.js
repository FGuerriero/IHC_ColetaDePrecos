import React, { useState, useEffect } from 'react';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import { SafeAreaView, Text, StyleSheet, TouchableOpacity, Alert, View, ImageBackground, Image, TextInput, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker'
import TakePic from './TakePic';
import { AntDesign } from '@expo/vector-icons';
import CurrencyInput from 'react-native-currency-input';
import ScanBarCode from './ScanningBarCode';

export default function SendPic(props) {
    const [startCamera, setStartCamera] = useState(false)
    const [startScannCodeBar, setStartScannCodeBar] = useState(false)
    const [photo, setPhoto] = useState(null)
    const [loja, setLoja] = useState("notSelected")
    const [produto, setProduto] = useState("notSelected")
    const [location, setLocation] = useState(null)
    const [locationErrorMsg, setLocationErrorMsg] = useState(null)
    const [loading, setLoading] = useState(false)
    const [value, setValue] = useState(0)
    const [barCode, setBarCode] = useState("Código do Produto")

    const __startCamera = async () =>{
        const {status} = await Camera.requestCameraPermissionsAsync()

        if(status === 'granted'){
            setStartCamera(true)
        }else{
            Alert.alert("O App não tem acesso á Camera. \nEntre nas configurações do dispositivo e habilite o acesso ao Coletor de preços!")
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
    },[])

    const sendInformation = async () => {
        //Validar Campos para envio da Coleta
        if(!photo){
            Alert.alert('Tire uma foto do Produto antes de enviar Coleta!')
            return
        }else if(barCode === 'Código do Produto'){
            Alert.alert('Escaneie Código do Produto antes de enviar Coleta!')
            return
        }else if( produto === 'notSelected' ){
            Alert.alert('Selecione Produto antes de enviar Coleta!')
            return
        } else if(loja === 'notSelected'){
            Alert.alert('Selecione Loja antes de enviar Coleta!')
            return
        }else if(value < 0.01){
            Alert.alert('Preço inválido! \nDigite um valor maior que R$0,01')
            return
        }

        setLoading(true)

        setTimeout(() => {
            props.handleNewPic(false)
            Alert.alert("Coleta de Preço do Produto realizada com sucesso!")
        }, 3500)

    }

    return (
        <SafeAreaView style={styles.container}>
            {startCamera ?
                <TakePic handleCamState={setStartCamera} photoMini={setPhoto}/> : 
                startScannCodeBar? <ScanBarCode handleScannState={setStartScannCodeBar} handleBarCode={setBarCode}/>:(
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
                            <Text style={styles.textPicButton}>{!!photo ? "Tirar Foto Novamente" : "Tirar Foto"}</Text>
                        </TouchableOpacity>
                        
                        <View style={styles.barCodeContainer}>
                            <Text style={styles.txtBarCode}>{barCode}</Text>
                            <TouchableOpacity 
                                style={styles.btnScannBarCode}
                                onPress={() => setStartScannCodeBar(true)}
                            >
                                <Text style={styles.textPicButton}>Escanear</Text>
                            </TouchableOpacity>
                        </View>

                        <Picker
                            style={styles.picker}
                            selectedValue={produto}
                            onValueChange={newValue => setProduto(newValue)}
                        >
                            <Picker.Item label='Selecione Produto' value='notSelected' key={0}/>
                            <Picker.Item label='Pão Francês' value='paoFrances' key={1}/>
                            <Picker.Item label='Arroz' value='arroz' key={2}/>
                            <Picker.Item label='Feijão' value='feijao' key={3}/>
                            <Picker.Item label='Linguiça Calabreza' value='linguicaCalabreza' key={4}/>
                            <Picker.Item label='Leite' value='leite' key={5}/>
                            <Picker.Item label='Livro' value='livro' key={6}/>
                            <Picker.Item label='Caderno' value='caderno' key={7}/>
                        </Picker>

                        <Picker
                            style={styles.picker}
                            selectedValue={loja}
                            onValueChange={newValue => setLoja(newValue)}
                        >
                            <Picker.Item label='Selecione Loja' value='notSelected' key={0}/>
                            <Picker.Item label='Extra Pirituba' value='extraPirituba' key={1}/>
                            <Picker.Item label='Açai Freguesia do Ó' value='acaiFreguesiaDoO' key={2}/>
                            <Picker.Item label='Dia Mutinga' value='diaMutinga' key={3}/>
                            <Picker.Item label='Pão de Açucar Vila Mariana' value='paoDeAcucarVilaMAriana' key={4}/>
                            <Picker.Item label='Carrefour Colônia Alemã' value='carrefourColoniaAlema' key={5}/>
                        </Picker>

                        <View style={styles.textFieldContainer}>
                            <Text style={styles.label}> Preço: </Text>
                            <CurrencyInput
                                style={styles.preco}
                                value={value}
                                onChangeValue={setValue}
                                prefix="R$"
                                delimiter="."
                                separator=","
                                precision={2}
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
                            <Text style={styles.btnText}>ENVIAR</Text>
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
    },
    preco: {
        borderWidth: 1,
        height: 30,
        paddingLeft: 10
    },
    label: {
        fontSize: 20,
        marginBottom: 5
    },
    textFieldContainer: {
        flex: .4,
        backgroundColor: '#fffb',
        marginVertical: 5,
        padding: 5
    },
    barCodeContainer: {
        flex: .2,
        flexDirection: 'row',
        // borderColor: 'black',
        // borderWidth: 5,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    btnScannBarCode: {
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: '#3cbfadc5',
        elevation: 5,
        width: 150,
        height: 35,
        borderWidth: .01,
        borderRadius: 40
    },
    txtBarCode: {
        paddingLeft: 10,
        fontSize: 16
    }
})