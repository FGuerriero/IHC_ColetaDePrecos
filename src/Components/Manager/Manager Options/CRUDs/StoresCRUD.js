import React, {useEffect, useState} from 'react';
import { Text, StyleSheet, View, ScrollView, TextInput, Modal, TouchableOpacity, ActivitstoreNameyIndicator, 
    DeviceEventEmitter, Alert, ActivityIndicator 
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Header from '../../../Header/Header';
import {db,authManager,collection, getDocs,addDoc,doc,query,where,deleteDoc, updateDoc} from "../../../../config/firebase.js";

function StoresCRUD({route, navigation}) {
    const [storeName, setStoreName] = useState(null)
    const [franchise, setFranchise] = useState(null)
    const [address, setAddress] = useState(null)
    const [loadVisible, setLoadVisible] = useState(false)

    const GravarLoja = async () => {
        if (storeName == '') {
            Alert.alert("Preencha o Nome da Loja!")      
        } else if (franchise == '') {
            Alert.alert("Preencha a Franquia!")  
        } else if (address == '') {
            Alert.alert("Preencha o Endereço!")  
        } else {
            setLoadVisible(true)
            await getDocs(collection(db, "Lojas")).then( async (snapShot) => {
                const newStore = snapShot.docs.filter((doc) => {
                    return ( doc.data().nome == storeName &&  doc.data().franquia == franchise)
                })
                //console.log("Current User: ", route.params)
                if(route.params){
                    if(newStore.length <= 1){
                        await updateDoc(doc(db,"Lojas",route.params.id),{
                            nome: storeName,
                            franquia: franchise,
                            endereço: address
                        }).then((resp) => {
                            console.log("Response: ", resp)
                            DeviceEventEmitter.emit("event.storeUpdated")
                            Alert.alert("Dados alterados com sucesso!")
    
                            setStoreName('');
                            setFranchise('');
                            setAddress('')
                            setLoadVisible(false)
    
                            navigation.goBack()
                        }).catch(error => {
                            Alert.alert(error)
                        })
                    }else{
                        Alert.alert("Já existe uma Loja cadastrada com mesmo nome e franquia!","Revisar dados.")
                        setLoadVisible(false)
                    }
                }else{
                    if(newStore.length == 0){
                        const newStore = await addDoc(collection(db, "Lojas"), {
                            nome: storeName,
                            franquia: franchise,
                            endereço: address
                        }).then( resp => {
                            //console.log("Sucesso ao Criar Produto: ", resp)
                            DeviceEventEmitter.emit("event.storeUpdated")
                            Alert.alert("Loja cadastrada com sucesso!")
                            navigation.goBack()
                            
                            setStoreName('');
                            setFranchise('');
                            setAddress('')
                            setLoadVisible(false)
                        }).catch( error => {
                            console.log("Erro ao tentar criar Loja", error)
                        })
                    }else{
                        Alert.alert("Já existe uma Loja cadastrada com mesmo nome e franquia!","Revisar dados.")
                        setLoadVisible(false)
                    }
                }
            })
        }
        return
    }

    useEffect(() => {
        if(route.params){
            setStoreName(route.params.nome)
            setFranchise(route.params.franquia)
            setAddress(route.params.endereço)
        }
    }, [])

    return(
        <View style={styles.container}>
            <Header />
            <ScrollView>
                <View style={styles.btnBackContainer}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <AntDesign name="leftcircle" size={40} color='#80808070' />
                    </TouchableOpacity>
                </View>
                <View style={styles.bodyContainer}>
                    <TextInput 
                        style={styles.inputText} 
                        placeholder={'Nome da Loja'}
                        value={storeName}
                        onChangeText={ text => setStoreName(text)}
                    />
                    <TextInput 
                        style={styles.inputText} 
                        placeholder={'Franquia'}
                        value={franchise}
                        onChangeText={ text => setFranchise(text)}
                    />
                    <TextInput 
                        style={styles.inputTextDescription} 
                        placeholder={'Endereço completo'}
                        onChangeText={ text => setAddress(text)}
                        value={address}
                        multiline={true}
                    />
                    <TouchableOpacity style={styles.btnGravar} onPress={() => GravarLoja()}>
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

export default StoresCRUD;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    btnBackContainer: {
        height: '25%',
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
        justifyContent: 'space-between',
        marginHorizontal: '3%',
        paddingBottom: '10%'
    },
    inputText: {
        //height: '100%',
        width: '100%',
        fontSize: 27,
        marginLeft: '2%',
        marginBottom: '7%',
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
        height: '11%',
        borderColor: '#868686',
        borderWidth: 2,
        width:'100%',
        borderRadius: 9.5,
        marginVertical: '10%'
    },
    picker: {
        //fontSize: 30,
        marginLeft: '3%'
    },
    btnGravar: {
        backgroundColor: '#A60A0A',
        margin: '10%',
        justifyContent: 'center',
        width: '100%',
        marginVertical: '10%',
        height: 40
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
    }
})