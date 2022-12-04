import React, {useEffect, useState} from 'react';
import { Text, StyleSheet, View, TextInput, Modal, TouchableOpacity, ActivityIndicator, DeviceEventEmitter, Alert, ScrollView, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker'
import Header from '../../../Header/Header';
import {db,authManager,collection, getDocs,addDoc,doc,query,where,deleteDoc, updateDoc} from "../../../../config/firebase.js";
import { cadastrar } from '../../../../servicos/requisicoesFirebase';

import {createUserWithEmailAndPassword} from "firebase/auth";

const accessLvls = ['Administrador', 'Supervisor', 'Coletor']

function ChecklistCRUD({route, navigation}) {
    const [productsAll, setProductsAll] = useState([
        {
            nome: 'Leite',
            marca: 'Parmalate',
            descricao: '',
            id: 'abcd'
        },{
            nome: 'Arroz',
            marca: 'Prato Fino',
            descricao: '',
            id: 'abcde'
        },{
            nome: 'Leite',
            marca: 'Parmalate',
            descricao: '',
            id: 'abcdf'
        },{
            nome: 'Arroz',
            marca: 'Prato Fino',
            descricao: '',
            id: 'abcdg'
        },{
            nome: 'Leite',
            marca: 'Parmalate',
            descricao: '',
            id: 'abcdh'
        },{
            nome: 'Arroz',
            marca: 'Prato Fino',
            descricao: '',
            id: 'abcdi'
        },
    ])
    const [productsOnList, setProductsOnList] = useState([
        {
            nome: 'Leite',
            marca: 'Parmalate',
            descricao: '',
            id: 'abcd'
        },{
            nome: 'Leite',
            marca: 'Parmalate',
            descricao: '',
            id: 'abcdf'
        },{
            nome: 'Leite',
            marca: 'Parmalate',
            descricao: '',
            id: 'abcdh'
        },{
            nome: 'Arroz',
            marca: 'Prato Fino',
            descricao: '',
            id: 'abcdi'
        },
    ])
    const [listItems, setListItems] = useState(productsAll)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [type, setType] = useState(null)
    const [tempPass, setTempPass] = useState('')
    const [uid, setUid] = useState(null)

    const [loadVisible, setLoadVisible] = useState(false)

    useEffect(() => {
        if(route.params){
            setName(route.params.nome)
            setEmail(route.params.email)
            setType(route.params.tipo)
            setUid(route.params.uid)
        }
        console.log(("Teste: ", !!1))
    }, [])

    const setSelected = (itemID) => {
        //console.log("ItemID: ",itemID)
        let indicator = false
        productsOnList.forEach((prod,index) => {
            if (Object.values(prod).indexOf(itemID) > -1) {
                //console.log("Index: ",Object.values(prod).indexOf(itemID))
                indicator = true
            }
            //console.log("Produto"+index+": ", Object.values(prod).indexOf(itemID)>-1)
        })
        return indicator
    }

    const pushPopListItems = (item) => {
        let indicator = false
        productsOnList.forEach( (prod,index) => {
            if (Object.values(prod).indexOf(item.id) > -1) {
                //console.log("Index: ",Object.values(prod).indexOf(itemID))
                indicator = true
            }
        })
        if(indicator){

        }else{

        }
    }
    const GravarDevice = async () => {
        if (name == '') {
            Alert.alert("Preencha Nome do Usuário")      
        } else if (email == '') {
            Alert.alert("Preencha email do Usuário")  
        } else if (tempPass == '' && !route.params) {
            Alert.alert("Preencha Senha Temporária do Usuário")  
        } else if (type === null) {
            Alert.alert("Selecione o Nível de acesso do Usuário!")
        } else {
            setLoadVisible(true)
            await getDocs(collection(db, "Usuarios")).then( async (snapShot) => {
                const newUser = snapShot.docs.filter((doc) => {
                    return doc.data().email == email
                })
                console.log("Current User: ", route.params)
                if(route.params){
                    if(newUser.length == 1){
                        await updateDoc(doc(db,"Usuarios",route.params.id),{
                            nome: name,
                            email,
                            tipo: type
                        }).then((resp) => {
                            console.log("Response: ", resp)
                        })
                        DeviceEventEmitter.emit("event.userUpdated")

                        setEmail('');
                        setTempPass('');
                        setType(null);
                        setUid('')
                        setLoadVisible(false)

                        navigation.goBack()
                    }else{
                        Alert.alert("Já existe uma conta cadastrada com este email!")
                        setLoadVisible(false)
                    }
                }else{
                    const resultado = await createUserWithEmailAndPassword(authManager, email, tempPass)
                        .then((dadosDoUsuario) => {
                            //console.log(dadosDoUsuario)
                            return dadosDoUsuario
                        })
                        .catch((error) => {
                            console.log(error);
                            return error
                        });
                    if (resultado.user) {
                        console.log("Cadastro realizado com sucesso!")
                        const newUser = await addDoc(collection(db, "Usuarios"), {
                            nome: name,
                            email: email,
                            tipo: type,
                            uid: resultado.user.uid
                        }).then( resp => {
                            DeviceEventEmitter.emit("event.userUpdated")
                            Alert.alert("Usuário cadastrado com sucesso!\nSenha do novo Usuário: "+tempPass)
                            navigation.goBack()
                            
                            setEmail('');
                            setTempPass('');
                            setType(null);
                            setUid('')
                            setLoadVisible(false)
                        }).catch(error => {
                            console.log("Erro ao tentar criar usuário", error)
                        })
                    }
                    else {
                        Alert.alert("Erro ao tentar cadastrar usuário.\nContate Administrador do Sistema!");
                        setLoadVisible(false)
                    }
                }
            })
        }
        return
    }

    return(
        <View style={styles.container}>
            <Header />
            <View style={styles.btnBackContainer}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <AntDesign name="leftcircle" size={40} color='#80808070' />
                </TouchableOpacity>
            </View>
            <View style={styles.bodyContainer}>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={type}
                        onValueChange={newValue => setType(newValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label='Loja' value={type} key={0} style={styles.pickerItemGrey}/>
                        {
                            accessLvls.map((item, index) => {
                                return (
                                    <Picker.Item label={item} value={item} key={index+1} style={styles.pickerItemBlack} />
                                )
                            })
                        }
                    </Picker>
                </View>
                <TextInput 
                    style={styles.inputText} 
                    placeholder={'Data: DD/MM/AAAA'}
                    value={name}
                    onChangeText={ text => setName(text)}
                />
                {
                    productsAll[0].nome == "" ?
                        <View style={styles.activeIndicator}>
                            <ActivityIndicator style={{ transform: [{ scaleX: 2 }, { scaleY: 2 }] }} animating={true} size="large" color="#c0c0c0"/>
                        </View>
                    :
                        <ScrollView style={styles.scrollContainer}>
                        {
                                listItems.map( (item,index) => {
                                    return(
                                        <View key={index} style={
                                            index === 0 ?
                                                [styles.itemContainer, {borderTopLeftRadius: 21, borderTopRightRadius: 21}]
                                            :
                                                (listItems.length-1) === index ?
                                                        [styles.itemContainer, {borderBottomLeftRadius: 21, borderBottomRightRadius: 21}]
                                                :
                                                        styles.itemContainer
                                        }>
                                            <TouchableOpacity style={styles.itemTouchable} onPress={() => {
                                                    setCurrentIndex(index)  
                                                }}>
                                                <View style={styles.textContainer}>
                                                    <Text style={[styles.itemTitle,]}>
                                                        {item.nome}
                                                    </Text>
                                                    <Text style={styles.itemSubtext}>
                                                        {item.marca}
                                                    </Text>
                                                </View>
                                                <View style={styles.selectionBoxContainer}>
                                                    {
                                                        
                                                        setSelected(item.id)?
                                                            <Image 
                                                                source={require('../../../../../assets/selected.png')} 
                                                            /> 
                                                        :
                                                            <Image 
                                                                source={require('../../../../../assets/unselected.png')}
                                                            />
                                                    }
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                })
                            }
                        </ScrollView>
                }
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
        </View>
    )
}

export default ChecklistCRUD;

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
        marginHorizontal: '3%',
        //marginTop: '5%',
        // borderWidth: 20,
        // borderColor: '#000'
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
        //flex: .1,
        padding: '4%',
        paddingLeft: 15
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
        marginVertical: '10%'
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
        //flex: 0.14,
        width: '100%',
        marginVertical: '10%',
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
    activeIndicator: {
      height: '40%',
      paddingTop: '10%'
    },
    scrollContainer: {
        paddingHorizontal: '3%',
        width: '100%',
        //height: 70
    },
    itemContainer: {
        flex: 1,
        borderColor: '#CCCCCC',
        borderWidth: 2
    },
    itemTouchable: {
        flexDirection: 'row',
        paddingVertical: '3%'
    },
    textContainer: {
        flex: 3,
        marginLeft: '7%'
    },
    itemTitle: {
        fontSize: 20.9,
        lineHeight: 25.47,
        fontWeight: '900',
        color: '#352727'
    },
    itemSubtext: {
        fontSize: 13.46,
        lineHeight: 16.4,
        fontWeight: '400',
        color: '#6F5F5F'
    },
    itemButtons: {
        flexDirection: 'row',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40
    },
    deleteButton: {
        backgroundColor: '#A60A0A',
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 40
    },
    editButton: {
        backgroundColor: '#F2BB13',
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 40
    },
    textButton: {
        color: '#fff',
        fontSize: 20.58,
        fontWeight: '600'
    },
    selectionBoxContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1 
    }
})