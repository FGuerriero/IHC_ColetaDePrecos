import React, {useEffect, useState} from 'react';
import { Text, StyleSheet, View, ScrollView, TextInput, Modal, TouchableOpacity, ActivityIndicator, DeviceEventEmitter, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker'
import {db,authManager,collection, getDocs,addDoc,doc,query,where,deleteDoc, updateDoc} from "../../../../config/firebase.js";

import Header from '../../../Header/Header';

function DevicesCRUD({route, navigation}) {
    const [USERS, setUSERS] = useState([])
    const [nickName, setNickName] = useState('')
    const [brand, setBrand] = useState('')
    const [model, setModel] = useState('')
    const [addressMAC, setAddressMAC] = useState('')
    const [sponsorIndex, setSponsorIndex] = useState(0)

    const [loadVisible, setLoadVisible] = useState(false)

    const GravarDevice = async () => {
        if (nickName == '') {
            Alert.alert("Preencha o Nome do Device!")      
        } else if (brand == '') {
            Alert.alert("Escolha a Marca do Dispositivo!")  
        } else if (model == '') {
            Alert.alert("Preencha o Modelo do Dispositivo!")  
        } else if (addressMAC == '') {
            Alert.alert("Preencha o MAC do Dispositivo!")  
        } else if (sponsorIndex == 0) {
            Alert.alert("Selecione o Responsável pelo Dispositivo!")  
            //console.log("TTTTTTTTTTTTT: ", sponsor)
        } else {
            setLoadVisible(true)
            await getDocs(collection(db, "Dispositivos")).then( async (snapShot) => {
                const newDevice = snapShot.docs.filter((doc) => {
                    return ( doc.data().endereçoMAC == addressMAC)
                })
                //console.log("Current User: ", route.params)
                if(route.params){
                    if(newDevice.length == 1){
                        await updateDoc(doc(db,"Dispositivos",route.params.id),{
                            nome: nickName,
                            marca: brand,
                            modelo: model,
                            endereçoMAC: addressMAC,
                            usuarioResponsavel: USERS[sponsorIndex-1].nome,
                            responsavelID: USERS[sponsorIndex-1].id,
                            responsavelUID: USERS[sponsorIndex-1].uid
                        }).then((resp) => {
                            console.log("Response: ", resp)
                            DeviceEventEmitter.emit("event.deviceUpdated")
                            Alert.alert("Dados alterados com sucesso!")
    
                            setNickName('');
                            setBrand('');
                            setModel('')
                            setAddressMAC('')
                            //setSponsor('')
                            setLoadVisible(false)
    
                            navigation.goBack()
                        })
                    }else{
                        Alert.alert("Já existe um dispositivo cadastrado com mesmo MAC address!","Revisar dados.")
                        setLoadVisible(false)
                    }
                }else{
                    if(newDevice.length == 0){
                        const newDevice = await addDoc(collection(db, "Dispositivos"), {
                            nome: nickName,
                            marca: brand,
                            modelo: model,
                            endereçoMAC: addressMAC,
                            usuarioResponsavel: USERS[sponsorIndex-1].nome,
                            responsavelID: USERS[sponsorIndex-1].id,
                            responsavelUID: USERS[sponsorIndex-1].uid
                        }).then( resp => {
                            //console.log("Sucesso ao Criar Produto: ", resp)
                            DeviceEventEmitter.emit("event.deviceUpdated")
                            Alert.alert("Dispositivo cadastrado com sucesso!")
                            navigation.goBack()
                            
                            setNickName('');
                            setBrand('');
                            setModel('')
                            setAddressMAC('')
                            setLoadVisible(false)
                        }).catch( error => {
                            console.log("Erro ao tentar criar dispositivo", error)
                        })
                    }else{
                        Alert.alert("Já existe um dispositivo cadastrado com mesmo MAC address!","Revisar dados.")
                        setLoadVisible(false)
                    }
                }
            })
        }
        return
    }

    useEffect(() => {
        if(route.params){
            setNickName(route.params.nome)
            setBrand(route.params.marca)
            setModel(route.params.modelo)
            setAddressMAC(route.params.endereçoMAC)
        }
        getDocs(collection(db, "Usuarios")).then( async (snapShot) => {
            const usuariosUpdated = snapShot.docs.map((doc, index) => {
                //console.log("Usuário "+index+": ", doc._document.key.path.segments.pop())
                let docId = doc._document.key.path.segments.pop()
                //console.log("TEEEEEE: ", docId )
                if(route.params && (docId == route.params.responsavelID)){
                    //setSponsor({...doc.data(), id: doc._document.key.path.segments.pop() })
                    //setSponsorIndex(index+1)
                    return {...doc.data(), id: docId , currSponsor: true}
                }
                return {...doc.data(), id: docId }
            })
            usuariosUpdated.sort((a,b) => {
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
            usuariosUpdated.forEach((usr,index) => {
                if(usr.currSponsor){
                    setSponsorIndex(index+1)
                }
            });
            //console.log("Brands: ", usuariosUpdated)
            setUSERS(usuariosUpdated)
            return
        }).catch( (error) => {
            Alert.alert("Erro ao tentar trazer Usuários")
            console.log("ERRO USUÁRIO!!", error)
        })
    }, [])

    return(
        <View style={styles.container}>
            <Header />
            <View style={styles.btnBackContainer}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <AntDesign name="leftcircle" size={40} color='#80808070' />
                </TouchableOpacity>
            </View>
            <ScrollView>
                <View style={styles.bodyContainer}>
                    <TextInput 
                        style={styles.inputText} 
                        placeholder={'Nome do Device'}
                        value={nickName}
                        onChangeText={ text => setNickName(text)}
                    />
                    <TextInput 
                        style={styles.inputText} 
                        placeholder={'Marca'}
                        value={brand}
                        onChangeText={ text => setBrand(text)}
                    />
                    <TextInput 
                        style={styles.inputText} 
                        placeholder={'Modelo'}
                        value={model}
                        onChangeText={ text => setModel(text)}
                    />
                    <TextInput 
                        style={styles.inputText} 
                        placeholder={'MAC address'}
                        value={addressMAC}
                        onChangeText={ text => setAddressMAC(text)}
                    />
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={sponsorIndex}
                            onValueChange={newValue => setSponsorIndex(newValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label='Selecione Responsável' value={0} key={0} style={styles.pickerItemGrey}/>
                            {
                                USERS.map((item, index) => {
                                    //console.log("Picker: ", item)
                                    return (
                                        <Picker.Item label={item.nome} value={index+1} key={index+1} style={styles.pickerItemBlack} />
                                    )
                                })
                            }
                        </Picker>
                    </View>
                    <TouchableOpacity style={styles.btnGravar} onPress={() => GravarDevice()}>
                        <Text style={styles.txtBtnGravar}>
                        {
                            loadVisible ? 
                                <ActivityIndicator animating={loadVisible} size="large" color="#fff"/>
                            :
                                'GRAVAR'
                        }
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}

export default DevicesCRUD;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    btnBackContainer: {
        height: 70,
        flexDirection: 'row',
        alignItems: 'center'
    },
    backButton: {
        elevation: 3,
        marginLeft: '2%'
    },
    bodyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: '3%'
    },
    inputText: {
        //height: '100%',
        width: '100%',
        fontSize: 27,
        marginLeft: '2%',
        marginBottom: '5%',
        borderColor: '#868686',
        borderWidth: 2,
        borderRadius: 9.5,
        flex: .1,
        padding: '4%'
    },
    inputTextDescription: {
        width: '100%',
        fontSize: 27,
        marginLeft: '2%',
        borderColor: '#868686',
        borderWidth: 2,
        borderRadius: 9.5,
        flex: .45,
        padding: '4%'
    },
    pickerContainer: {
        //height: '11%',
        borderColor: '#868686',
        borderWidth: 2,
        width:'100%',
        borderRadius: 9.5,
        //marginVertical: '10%'
    },
    picker: {
        //fontSize: 30,
        marginLeft: '3%'
    },
    btnGravar: {
        backgroundColor: '#A60A0A',
        margin: '5%',
        height: 40,
        justifyContent: 'center',
        flex: 0.14,
        width: '100%',
        marginTop: '30%',
        marginBottom: '20%'
    },
    txtBtnGravar: {
        fontSize: 19.76,
        fontWeight: '700',
        alignSelf: 'center',
        color: '#fff'
    },
    pickerItemGrey: {
        fontSize: 27,
        color: '#868686'
    },
    pickerItemBlack: {
        fontSize: 27,
        color: '#000'
    },
})