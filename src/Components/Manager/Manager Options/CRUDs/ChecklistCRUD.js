import React, {useEffect, useState} from 'react';
import { Text, StyleSheet, View, TextInput, Modal, TouchableOpacity, ActivityIndicator, DeviceEventEmitter, Alert, ScrollView, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker'
import DateTimePicker from '@react-native-community/datetimepicker';
import Header from '../../../Header/Header';
import {db,authManager,collection, getDocs,addDoc,doc,query,where,deleteDoc, updateDoc} from "../../../../config/firebase.js";
import { cadastrar } from '../../../../servicos/requisicoesFirebase';

import {createUserWithEmailAndPassword} from "firebase/auth";

function ChecklistCRUD({route, navigation}) {
    const [STORES,setSTORES] = useState([])
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
        // ,{
        //     nome: 'Leite',
        //     marca: 'Parmalate',
        //     descricao: '',
        //     id: 'abcdf'
        // },{
        //     nome: 'Leite',
        //     marca: 'Parmalate',
        //     descricao: '',
        //     id: 'abcdh'
        // },{
        //     nome: 'Arroz',
        //     marca: 'Prato Fino',
        //     descricao: '',
        //     id: 'abcdi'
        // },
    ])
    const [listItems, setListItems] = useState(productsAll)
    const [storeIndex, setStoreIndex] = useState(0)
    const [date, setDate] = useState('')
    const [pickerDatePresenting, setPickerDatePresenting] = useState('Selecione a Data')
    const [pickerDateControl, setPickerDateControl] = useState(new Date())

    const [datePicker, setDatePicker] = useState(false);

    const [loadVisible, setLoadVisible] = useState(false)
    const [fetchingProducts, setfetchingProducts] = useState(true)

    useEffect(() => {
        //-------------Buscar Lojas
        console.log("Entrou no Use Effect")
        getDocs(collection(db, "Lojas")).then( async (snapShot) => {
            const lojasUpdated = snapShot.docs.map((doc, index) => {
                let docId = doc._document.key.path.segments.pop()
                if(route.params && (docId == route.params.lojaID)){
                    return {...doc.data(), id: docId , currStore: true}
                }
                return {...doc.data(), id: docId }
            })
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

        //-------Buscar Produtos
        getDocs(collection(db, "Produtos")).then( async (snapShot) => {
            const produtosUpdated = snapShot.docs.map((doc, index) => {
                return {...doc.data(), id: doc._document.key.path.segments.pop() }
            })
            //console.log("Produtos: ", produtosUpdated)
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
            //console.log("Brands: ", lojasUpdated)
            setProductsAll(produtosUpdated)
            setListItems(produtosUpdated)
            setfetchingProducts(false)
            return
        }).catch( (error) => {
            Alert.alert("Erro ao tentar trazer Produtos")
            console.log("ERRO PRODUTOS!!", error)
        })

        if(Object.keys(route.params).indexOf('list') > -1){
            setDate(route.params.data)
            setPickerDatePresenting(`${route.params.data.substring(8,10)+'/'+route.params.data.substring(5,7)+'/'+route.params.data.substring(0,4)}`)
            setPickerDateControl(new Date(route.params.data.substring(0,4),Number(route.params.data.substring(5,7))-1,route.params.data.substring(8,10)))
            setProductsOnList(route.params.list)
            setStoreIndex(STORES.filter( str => {
                return str.id === route.params.lojaID
            })[0])
            // setName(route.params.nome)
            // setEmail(route.params.email)
            // setType(route.params.tipo)
            // setUid(route.params.uid)
        }
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
        let indicator = 0
        productsOnList.forEach( (prod,index) => {
            if (Object.values(prod).indexOf(item.id) > -1) {
                //console.log("Index: ",Object.values(prod).indexOf(itemID))
                indicator = index+1
            }
        })
        //console.log("Indicator: ", item)
        if(indicator){
            setProductsOnList(productsOnList.filter( (prod,index) => {
                return (index!=indicator-1)
            }))
        }else{
            setProductsOnList([...productsOnList, item])
        }
    }
    const GravarLista = async () => {
        if (storeIndex == 0) {
            Alert.alert("Selecione a Loja!")      
        } else if (date == '') {
            Alert.alert("Preencha data da Lista","Esta é a data que a coleta deve acontecer.")  
        } else if (productsOnList.length == 0) {
            Alert.alert("Selecione ao menos 1 item para esta Lista!")  
        } else {
            setLoadVisible(true)
            await getDocs(collection(db, "ColetasListas")).then( async (snapShot) => {
                const newList = snapShot.docs.filter((doc,index) => {
                    return ((doc.data().coletorID === route.params.coletorID) && (doc.data().data === date) && (doc.data().lojaID === STORES[storeIndex-1].id))
                })
                //console.log("Current User: ", route.params)
                if(Object.keys(route.params).indexOf('list') > -1){
                    //console.log("Chegou! ",route.params.id)
                    await updateDoc(doc(db,"ColetasListas",route.params.id),{
                        coletorID: route.params.coletorID,
                        lojaID: STORES[storeIndex-1].id,
                        nomeLoja: STORES[storeIndex-1].nome,
                        data: date,
                        list: productsOnList
                    }).then((resp) => {
                        console.log("Response: ", resp)
    
                        setStoreIndex(0);
                        setDate('');
                        setLoadVisible(false)
    
                        navigation.goBack()
                    }).catch(err => {
                        Alert.alert("Erro ao tentar alterar Lista!")
                        setLoadVisible(false)
                    })
                    DeviceEventEmitter.emit("event.listUpdated")
                }else{
                    if(newList.length == 0){
                        const newList = await addDoc(collection(db, "ColetasListas"), {
                            coletorID: route.params.coletorID,
                            lojaID: STORES[storeIndex-1].id,
                            nomeLoja: STORES[storeIndex-1].nome,
                            data: date,
                            list: productsOnList
                        }).then( resp => {
                            //console.log("Sucesso ao Criar Produto: ", resp)
                            Alert.alert("Lista cadastrada com sucesso!")
                            navigation.goBack()
                            
                            setStoreIndex(0);
                            setDate('');
                            setLoadVisible(false)
                        }).catch( error => {
                            console.log("Erro ao tentar criar Lista", error)
                        })
                        DeviceEventEmitter.emit("event.listUpdated")
                    }else{
                        Alert.alert("Já existe uma Lista cadastrada para este coletor no mesmo dia e local!")
                        setLoadVisible(false)
                    }
                }
            }).catch(err => {
                console.log("Error: ", err)
                Alert.alert("Erro ao tentar gravar no Servidor.", "Tente novamente mais tarde!")
                setLoadVisible(false)
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
                        selectedValue={storeIndex}
                        onValueChange={newValue => setStoreIndex(newValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label='Loja' value={0} key={0} style={styles.pickerItemGrey}/>
                        {
                            STORES.map((item, index) => {
                                return (
                                    <Picker.Item label={item.nome} value={index+1} key={index+1} style={styles.pickerItemBlack} />
                                )
                            })
                        }
                    </Picker>
                </View>
                <TouchableOpacity style={styles.listDate} onPress={() => setDatePicker(true)}>
                    <Text style={styles.listDateText}>{pickerDatePresenting}</Text>
                </TouchableOpacity>
                {datePicker && 
                    <DateTimePicker
                        value={pickerDateControl}
                        mode={'date'}
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        is24Hour={true}
                        minimumDate={new Date()}
                        onChange={(event,value) => {
                            setDatePicker(false)
                            setPickerDatePresenting(`${value.getDate().toString().padStart(2, '0')}/${(value.getMonth()+1).toString().padStart(2,'0')}/${value.getFullYear()}`)
                            setPickerDateControl(value)
                            setDate(value.toISOString().split('T')[0])
                        }}
                        style={styles.datePicker}
                    />
                }
                {
                    fetchingProducts ?
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
                                                    pushPopListItems(item)  
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
                <TouchableOpacity style={styles.btnGravar} onPress={() => GravarLista()}>
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
    listDate: {
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
        marginVertical: '5%'
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
        marginVertical: '8%',
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
    },
    datePicker: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: 320,
        height: 260,
        display: 'flex',
    },
    listDateText: {
        fontSize: 25
    }
})