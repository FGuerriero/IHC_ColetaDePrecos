import React, { useState, useEffect } from 'react';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import { SafeAreaView, Text, StyleSheet, TouchableOpacity, Alert, View, ScrollView, ImageBackground, Image, TextInput, ActivityIndicator, DeviceEventEmitter } from 'react-native';
import { Picker } from '@react-native-picker/picker'
import { AntDesign } from '@expo/vector-icons';
import CurrencyInput from 'react-native-currency-input';
import ScanBarCode from './ScanningBarCode';
import Header from '../Header/Header';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {db,authManager,collection, getDocs,addDoc,doc,query,where,deleteDoc, updateDoc} from "../../config/firebase.js";
import { getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import uuid from "uuid";

export default function SendPic({ route, navigation }) {
    const [PRODUCTS, setPRODUCTS] = useState([])
    const [STORES, setSTORES] = useState([])
    const [BRANDS, setBRANDS] = useState([])
    const [startScannCodeBar, setStartScannCodeBar] = useState(false)
    const [photo, setPhoto] = useState(null)
    const [loja, setLoja] = useState("notSelected")
    const [marca, setMarca] = useState("notSelected")
    const [locationErrorMsg, setLocationErrorMsg] = useState(null)
    const [loading, setLoading] = useState(false)
    const [value, setValue] = useState(0)
    const [valueCheck, setValueCheck] = useState(0)
    const [barCode, setBarCode] = useState("Código do Produto")
    const [productIndex, setProductIndex] = useState(0)
    const [storeIndex, setStoreIndex] = useState(0)
    
    const [startCamera, setStartCamera] = useState(false)
    const [produto, setProduto] = useState("notSelected")
    const [location, setLocation] = useState(null)

    const __startCamera = async () =>{
        const {status} = await Camera.requestCameraPermissionsAsync()

        if(status === 'granted'){
            navigation.push('TakePic') 
        }else{
            Alert.alert("O App não tem acesso á Camera. \nEntre nas configurações do dispositivo e habilite o acesso ao Coletor de preços!")
        }
    }

    async function uploadImageAsync(uri) {
        // Why are we using XMLHttpRequest? See:
        // https://github.com/expo/expo/issues/2402#issuecomment-443726662
        const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function () {
            resolve(xhr.response);
          };
          xhr.onerror = function (e) {
            console.log(e);
            reject(new TypeError("Network request failed"));
          };
          xhr.responseType = "blob";
          xhr.open("GET", uri, true);
          xhr.send(null);
        });
      
        const fileRef = ref(getStorage(), uuid.v4());
        const result = await uploadBytes(fileRef, blob);
      
        // We're done with the blob, close and release it
        blob.close();
      
        return await getDownloadURL(fileRef);
      }

    //Reload Hook
    useEffect( () => {

        DeviceEventEmitter.addListener("event.pictureCapture", (eventData) => {
            setPhoto(eventData.capturedImage)
        });

        //---------------------MARCAS-------------------
        getDocs(collection(db, "Marcas")).then( async (snapShot) => {
            const brandsUpdated = snapShot.docs.map((doc) => {
                return doc.data().nome
            })
            brandsUpdated.sort((a,b) => {
                const nameA = a.toUpperCase(); // ignore upper and lowercase
                const nameB = b.toUpperCase(); // ignore upper and lowercase
                if (nameA < nameB) {
                return -1;
                }
                if (nameA > nameB) {
                return 1;
                }
            
                // names must be equal
                return 0;
            })
            //console.log("Brands: ", brandsUpdated)
            setBRANDS(brandsUpdated)
            return
        })
        //---------------------PRODUTOS-------------------
        getDocs(collection(db, "Produtos")).then( async (snapShot) => {
            const produtosUpdated = snapShot.docs.map((doc, index) => {
                let docId = doc._document.key.path.segments.pop()
                if(route.params && (docId == route.params.id)){
                    return {...doc.data(), id: docId , currProduct: true}
                }
                return {...doc.data(), id: docId }
            })
            produtosUpdated.sort((a,b) => {
                const nameA = a.nome.toUpperCase(); // ignore upper and lowercase
                const nameB = b.nome.toUpperCase(); // ignore upper and lowercase
                if (nameA < nameB) {
                return -1;
                }
                if (nameA > nameB) {
                return 1;
                }
            
                // names must be equal
                return 0;
            })
            produtosUpdated.forEach((usr,index) => {
                if(usr.currProduct){
                    setProductIndex(index+1)
                }
            });
            //console.log("Brands: ", produtosUpdated)
            setPRODUCTS(produtosUpdated)
            return
        }).catch( (error) => {
            Alert.alert("Erro ao tentar trazer Produtos")
            console.log("ERRO PRODUTOS!!", error)
        })
        //---------------------LOJAS-------------------
        getDocs(collection(db, "Lojas")).then( async (snapShot) => {
            const lojasUpdated = snapShot.docs.map((doc, index) => {
                let docId = doc._document.key.path.segments.pop()
                if(route.params && (docId == route.params.lojaID)){
                    return {...doc.data(), id: docId , currStore: true}
                }
                return {...doc.data(), id: docId }
            })
            //console.log("Stores: ", route.params)
            lojasUpdated.sort((a,b) => {
                const nameA = a.nome.toUpperCase(); // ignore upper and lowercase
                const nameB = b.nome.toUpperCase(); // ignore upper and lowercase
                if (nameA < nameB) {
                return -1;
                }
                if (nameA > nameB) {
                return 1;
                }
            
                // names must be equal
                return 0;
            })
            lojasUpdated.forEach((store,index) => {
                if(store.currStore){
                    setStoreIndex(index+1)
                }
            });
            //console.log("Brands: ", lojasUpdated)
            setSTORES(lojasUpdated)
            return
        }).catch( (error) => {
            Alert.alert("Erro ao tentar trazer Lojas")
            console.log("ERRO LOJAS!!", error)
        })
        
        //console.log("Current Item: ", route.params)
        const updateLocate = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted' && photo === null) {
                setLocationErrorMsg('Permission to access location was denied');
                console.log('GPS location: ', locationErrorMsg)
            }
    
            let myLocation = await Location.getCurrentPositionAsync({})
            setLocation(myLocation)
        }

        updateLocate()

        //-----------------Verifica se veio de CheckList-----------------
        if(route.params){
            //setProduto(route.params.itemCategory)
            //setLoja(route.params.storeName)
            setMarca(route.params.marca)
            route.params.codigoBarras ? setBarCode(route.params.codigoBarras) : undefined
            route.params.preço && setValue(route.params.preço) 
            route.params.url && setPhoto({uri: route.params.url})
        }
    },[])

    const sendInformation = async () => {
        //Validar Campos para envio da Coleta
        if(!photo){
            Alert.alert('Tire uma foto do Produto antes de enviar Coleta!')
            return
        }else if(barCode === 'Código do Produto'){
            Alert.alert('Escaneie Código do Produto antes de enviar Coleta!')
            return
        }else if( productIndex === 0 ){
            Alert.alert('Selecione Produto antes de enviar Coleta!')
            return
        } else if(storeIndex === 0){
            Alert.alert('Selecione Loja antes de enviar Coleta!')
            return
        }else if(value < 0.01 && valueCheck < 0.01){
            Alert.alert('Preço inválido! \nDigite um valor maior que R$0,009')
            return
        }else if(value != valueCheck){
            Alert.alert('Os Campos "Preço" e "Confirmar Preço" devem ser iguais!')
            return
        }else if(marca === "notSelected"){
            Alert.alert('Digite a Marca do produto antes de enviar Coleta!')
            return
        }

        setLoading(true)

        const uploadedURL = await uploadImageAsync(photo.uri)

        if(route.params){
            let currList
            await getDoc(doc(db,"ColetasListas",route.params.listID))
            .then(snap => {
                currList = snap.data()
            })
            .catch(err => {
                Alert.alert("ERROR: ", err)
                console.log("ERROR: ", err)
                return
            })

            let currListIndex 
            currList.list.forEach((prod,index) => {
                prod.id === route.params.id ? currListIndex = index : undefined
                return
            })

            currList.list[currListIndex] = {
                nome: PRODUCTS[productIndex-1].nome,
                id: PRODUCTS[productIndex-1].id,
                descricao: PRODUCTS[productIndex-1].descricao,
                marca: marca,
                preço: value,
                codigoBarras: barCode,
                url: uploadedURL,
                lojaID: STORES[storeIndex-1].id,
                nomeLoja: STORES[storeIndex-1].nome,
                coletado: true
            }

            let countCollected = 0
            currList.list.forEach(item => {
                item.coletado && countCollected++
                return
            })

            currList.concluida = (currList.list.length == countCollected)

            // -------------------    UPDATE    ---------------
            await updateDoc(doc(db,"ColetasListas",route.params.listID),currList).then((resp) => {
                //console.log("Response: ", resp)
                Alert.alert("Coleta realizada com sucesso!")
                DeviceEventEmitter.emit("event.collectionUpdated", {listID: currList.id})

                navigation.goBack()
            }).catch(error => {
                Alert.alert("ERROR: ", error)
                console.log("ERROR: ", error)
            })
        }else{

            await addDoc(collection(db,"ListaLivre"),{
                nome: PRODUCTS[productIndex-1].nome,
                id: PRODUCTS[productIndex-1].id,
                descricao: PRODUCTS[productIndex-1].descricao,
                marca: marca,
                preço: value,
                codigoBarras: barCode,
                url: uploadedURL,
                lojaID: STORES[storeIndex-1].id,
                nomeLoja: STORES[storeIndex-1].nome,
                coletado: true
            }).then((resp) => {
                //console.log("Response: ", resp)
                Alert.alert("Coleta realizada com sucesso!")

                navigation.goBack()
            }).catch(error => {
                Alert.alert("ERROR: ", error)
                console.log("ERROR: ", error)
            })
        }

                
        //--------------Zerando Variáveis
        setProductIndex(0)
        setMarca("notSelected")
        setValue(0)
        setValueCheck(0)
        setBarCode('Código do Produto')
        setPhoto(null)
        setStoreIndex(0)
        setLoading(true)

        // setTimeout(() => {
        //     navigation.goBack()
        //     Alert.alert("Coleta de Preço do Produto realizada com sucesso!")
        // }, 3500)
    }

    return (
        <SafeAreaView style={styles.container}>
            {
                startScannCodeBar? <ScanBarCode handleScannState={setStartScannCodeBar} handleBarCode={setBarCode}/>:(
                <View style={styles.subContainer}>
                    <Header />
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                            <AntDesign name="leftcircle" size={40} color='#80808070' />
                        </TouchableOpacity>
                    </View>
                    <KeyboardAwareScrollView style={styles.scrollContainer}>
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
                                selectedValue={productIndex}
                                onValueChange={newValue => setProductIndex(newValue)}
                                style={styles.picker}
                                enabled={!route.params}
                            >
                                <Picker.Item label='Selecione Produto' value={0} key={0} style={styles.pickerItemGrey}/>
                                {
                                    PRODUCTS.map((item, index) => {
                                        //console.log("Picker: ", item)
                                        return (
                                            <Picker.Item label={item.nome} value={index+1} key={index+1} style={styles.pickerItemBlack} />
                                        )
                                    })
                                }
                            </Picker>

                            <Picker
                                selectedValue={storeIndex}
                                onValueChange={newValue => setStoreIndex(newValue)}
                                style={styles.picker}
                                enabled={!route.params}
                            >
                                <Picker.Item label='Selecione Loja' value={0} key={0} style={styles.pickerItemGrey}/>
                                {
                                    STORES.map((item, index) => {
                                        //console.log("Picker: ", item)
                                        return (
                                            <Picker.Item label={item.nome} value={index+1} key={index+1} style={styles.pickerItemBlack} />
                                        )
                                    })
                                }
                            </Picker>

                            <Picker
                                selectedValue={marca}
                                onValueChange={newValue => setMarca(newValue)}
                                style={styles.picker}
                                enabled={!route.params}
                            >
                                <Picker.Item label='Selecione Marca' value={null} key={0} style={styles.pickerItemGrey}/>
                                {
                                    BRANDS.map((item, index) => {
                                        return (
                                            <Picker.Item label={item} value={item} key={index+1} style={styles.pickerItemBlack} />
                                        )
                                    })
                                }
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
                                <Text style={styles.label}> Confirmar Preço: </Text>
                                <CurrencyInput
                                    style={styles.preco}
                                    value={valueCheck}
                                    onChangeValue={setValueCheck}
                                    prefix="R$"
                                    delimiter="."
                                    separator=","
                                    precision={2}
                                />
                            </View>
                        </View>


                        <View style={styles.footer}>
                            <TouchableOpacity style={styles.submitBtn} onPress={ sendInformation }>
                                {
                                    loading?
                                    <ActivityIndicator animating={loading} size="large" color="#FFF"/>:
                                    <Text style={styles.btnText}>GRAVAR</Text>
                                }
                            </TouchableOpacity>
                        </View>
                    </KeyboardAwareScrollView>
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
        flex: 1
    },
    header: {
        height: 50,
        justifyContent: 'space-between',
        marginTop: '4%',
        // borderWidth: 1,
        // borderColor: '#000'
    },
    scrollContainer: {
        flex: .92,
    },
    body: {
        flex: .8,
        justifyContent: 'flex-start',
        marginHorizontal: '5%',
        marginBottom: '5%'
    },
    footer: {
        height: 40,
        marginHorizontal: '5%',
        marginVertical:'5%'
    },
    submitBtn: {
        flex: 1,
        backgroundColor: '#A60A0A',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5
    },
    miniImg: {
        height: 200,
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
        backgroundColor: '#A60A0A',
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
        borderColor: '#A60A0A99'
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
        height: '5%',
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
        alignSelf: 'flex-start',
        elevation: 3,
        marginLeft: '2%'
    },
    preco: {
        borderWidth: 1,
        height: '20%',
        paddingLeft: 10,
        borderRadius: 8,
        borderColor: '#BFBFBF',
        marginBottom: '5%'
    },
    inputMarca: {
        borderWidth: 1,
        height: '20%',
        paddingLeft: 10,
        borderRadius: 8,
        borderColor: '#BFBFBF',
        marginBottom: '3%'
    },
    label: {
        fontSize: 22,
        marginBottom: 5,
        fontWeight: 'bold'
    },
    textFieldContainer: {
        height: '40%',
        //backgroundColor: '#fffb',
        marginBotton: '10%',
        padding: 5,
        fontSize: 25
    },
    barCodeContainer: {
        flex: .2,
        flexDirection: 'row',
        // borderColor: 'black',
        // borderWidth: 5,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '5%'
    },
    btnScannBarCode: {
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: '#F2BB13',
        elevation: 5,
        width: 150,
        height: 35,
        borderWidth: .01,
        borderRadius: 40
    },
    txtBarCode: {
        paddingLeft: 10,
        fontSize: 16
    },
    pickerItemGrey: {
        fontSize: 20,
        color: '#868686'
    },
    pickerItemBlack: {
        fontSize: 25,
    }
})