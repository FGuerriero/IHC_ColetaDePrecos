import React, {useEffect, useState} from 'react';
import { Text, StyleSheet, View, ScrollView, TextInput, Modal, TouchableOpacity, ActivityIndicator, DeviceEventEmitter, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker'
import Header from '../../../Header/Header';
import { NavigationHelpersContext } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {db,authManager,collection, getDocs,addDoc,doc,query,where,deleteDoc, updateDoc} from "../../../../config/firebase.js";


function ProductsCRUD({route, navigation}) {
    const [BRANDS, setBRANDS] = useState([])
    const [productName, setProductName] = useState('')
    const [productBrand, setProductBrand] = useState('')
    const [productDescription, setProductDescription] = useState('')
    const [loadVisible, setLoadVisible] = useState(false)

    const GravarProduto = async () => {
        if (productName == '') {
            Alert.alert("Preencha o Nome do Produto!")      
        } else if (productBrand == '') {
            Alert.alert("Escolha a Marca do Produto!")  
        } else if (productDescription == '') {
            Alert.alert("Preencha a Descrição do produto!")  
        } else {
            setLoadVisible(true)
            await getDocs(collection(db, "Produtos")).then( async (snapShot) => {
                const newProduct = snapShot.docs.filter((doc) => {
                    return ( doc.data().nome == productName &&  doc.data().marca == productBrand)
                })
                //console.log("Current User: ", route.params)
                if(newProduct[0]){
                    if(route.params){
                        await updateDoc(doc(db,"Produtos",route.params.id),{
                            nome: productName,
                            marca: productBrand,
                            descricao: productDescription
                        }).then((resp) => {
                            console.log("Response: ", resp)
                            DeviceEventEmitter.emit("event.productUpdated")
                            Alert.alert("Dados alterados com sucesso!")
    
                            setProductName('');
                            setProductBrand('');
                            setProductDescription('')
                            setLoadVisible(false)
    
                            navigation.goBack()
                        })
                    }else{
                        Alert.alert("Já existe um produto cadastrado com mesmo nome e marca!","Revisar dados.")
                        setLoadVisible(false)
                    }
                }else{
                    const newProduct = await addDoc(collection(db, "Produtos"), {
                        nome: productName,
                        marca: productBrand,
                        descricao: productDescription
                    }).then( resp => {
                        //console.log("Sucesso ao Criar Produto: ", resp)
                        DeviceEventEmitter.emit("event.productUpdated")
                        Alert.alert("Produto cadastrado com sucesso!")
                        navigation.goBack()
                        
                        setProductName('');
                        setProductBrand('');
                        setProductDescription('')
                        setLoadVisible(false)
                    }).catch( error => {
                        console.log("Erro ao tentar criar produto", error)
                    })
                }
            })
        }
        return
    }

    useEffect(() => {
        if(route.params){
            setProductName(route.params.nome)
            setProductBrand(route.params.marca)
            setProductDescription(route.params.descricao)
        }

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
    }, [])

    return(
        <View style={styles.container}>
            <Header />
            <View style={styles.btnBackContainer}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <AntDesign name="leftcircle" size={40} color='#80808070' />
                </TouchableOpacity>
            </View>
            <KeyboardAwareScrollView>
                <View style={styles.bodyContainer}>
                    <TextInput 
                        style={styles.inputText} 
                        placeholder={'Nome do Produto'}
                        value={productName}
                        onChangeText={ text => setProductName(text)}
                    />
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={productBrand}
                            onValueChange={newValue => setProductBrand(newValue)}
                            style={styles.picker}
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
                    </View>
                    <TextInput 
                        style={styles.inputTextDescription} 
                        placeholder={'Descrição do Produto'}
                        onChangeText={ text => setProductDescription(text)}
                        value={productDescription}
                        multiline={true}
                    />
                    <TouchableOpacity style={styles.btnGravar} onPress={() => GravarProduto()}>
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
            </KeyboardAwareScrollView>
        </View>
    )
}

export default ProductsCRUD;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    btnBackContainer: {
        height: 60,
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
        paddingTop: '10%'
    },
    inputText: {
        //height: '100%',
        width: '100%',
        fontSize: 27,
        marginLeft: '2%',
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
        height: '18%',
        borderColor: '#868686',
        borderWidth: 2,
        width:'100%',
        borderRadius: 9.5,
        marginVertical: '10%'
    },
    btnGravar: {
        backgroundColor: '#A60A0A',
        margin: '5%',
        height: 50,
        justifyContent: 'center',
        flex: 0.14,
        width: '100%',
        marginVertical: '15%'
    },
    txtBtnGravar: {
        fontSize: 19.76,
        fontWeight: '700',
        alignSelf: 'center',
        color: '#fff'
    },
    picker: {
        //fontSize: 30,
        marginLeft: '3%'
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