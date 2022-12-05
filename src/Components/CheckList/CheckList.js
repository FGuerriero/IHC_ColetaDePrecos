import React, {useState, useEffect, useContext} from 'react';
import { Text, StyleSheet, TouchableOpacity, View, Image, ScrollView, TextInput, Modal, Alert, Pressable, DeviceEventEmitter, ActivityIndicator } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {db,collection, getDocs,addDoc,doc,query,where,deleteDoc, updateDoc} from "../../config/firebase.js";
import { getDoc } from 'firebase/firestore';

import Header from '../Header/Header';
import {AuthContext} from '../../Context/context'

function CheckList({navigation}) {
    const [checkListItems, setCheckListItems] = useState([])
    const [listItems, setListItems] = useState(checkListItems)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [clearModalVisible, setClearModalVisible] = useState(false)
    const { userAuth } = useContext(AuthContext)
    const [fetchingLists, setFetchingLists] = useState(true)
    const [loading, setLoading] = useState(false)

    function SortArrayObj(a, b) {
        const nameA = a.nomeLoja.toUpperCase(); // ignore upper and lowercase
        const nameB = b.nomeLoja.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
      
        // names must be equal
        return 0;
    }

    const clearCollection = async () => {
        setLoading(true)
        let currList
        await getDoc(doc(db,"ColetasListas",listItems[currentIndex].listID))
        .then(snap => {
            currList = snap.data()
        })
        .catch(err => {
            Alert.alert("ERROR: ", err)
            console.log("ERROR: ", err)
            return
        })

        let currListIndex 
        //console.log("Text00000000: ", currList)
        currList.list.forEach((prod,index) => {
            prod.id === listItems[currentIndex].id ? currListIndex = index : undefined
            return
        })
        //console.log("Antes: ", currListIndex)
        currList.list[currListIndex] = {
            id: listItems[currentIndex].id,
            nome: listItems[currentIndex].nome,
            marca: listItems[currentIndex].marca,
            descricao: listItems[currentIndex].descricao
        }
        //console.log("Depois: ", currList)

        await updateDoc(doc(db,"ColetasListas",listItems[currentIndex].listID),currList).then((resp) => {
            //console.log("Response: ", resp)
            Alert.alert("Dados deletados com sucesso!")

            updateChecklist()
            setClearModalVisible(!clearModalVisible)
        }).catch(error => {
            Alert.alert("ERROR: ", error)
            console.log("ERROR: ", error)
        })

        setLoading(false)
    }

    const updateChecklist = () => {
        getDocs(collection(db, "ColetasListas")).then( async (snapShot) => {
            let listasColl = snapShot.docs.map((doc,index) => {
                return {...doc.data(), id: doc._document.key.path.segments.pop()}
            })

            listasColl = listasColl.filter(list => {
                //console.log("Coletor: ", list.data === new Date().toISOString().split('T')[0])
                return ((list.coletorID === userAuth.id) && (list.data === new Date().toISOString().split('T')[0]))
            })
            //console.log("List: ", listasColl)
            
            listasColl.sort( SortArrayObj )
            //console.log("Length: ", listasColl)
            if(listasColl.length >= 2){
                listasColl = listasColl.reduce((acc, curr, index) => {
                    if(index === 1){
                        let listHandlerAcc = acc.list.map(LI => {
                            return { ...LI,  listID: acc.id, nomeLoja: acc.nomeLoja, lojaID: acc.lojaID}
                        });
                        let listHandlerCurr = curr.list.map(LI => {
                            return { ...LI,  listID: curr.id, nomeLoja: curr.nomeLoja, lojaID: curr.lojaID}
                        });
                        return [...listHandlerAcc, ...listHandlerCurr]
                    }else{
                        let listHandlerCurr = curr.list.map(LI => {
                            return { ...LI,  listID: curr.id, nomeLoja: curr.nomeLoja, lojaID: curr.ilojaIDd}
                        });
                        return [...acc, ...listHandlerCurr]
                    }
                })
                console.log("ACTUAL: ", listasColl)
            } else if(listasColl.length === 1){
                listasColl = listasColl[0].list.map(list => {
                    return { ...list,  listID: listasColl[0].id, nomeLoja: listasColl[0].nomeLoja, lojaID: listasColl[0].lojaID}
                })
            }
            setCheckListItems(listasColl)
            setListItems(listasColl)

        }).catch(err => {
            Alert.alert("Falha ao tentar buscar Listas.", "Contacte Administrador")
            console.log("ERROR: ", err)
        })
        setFetchingLists(false)
    }

    useEffect(() => {
        
        DeviceEventEmitter.addListener("event.collectionUpdated", () => {
            console.log("Edited Collection")
            setFetchingLists(true)
            updateChecklist()
        });

        updateChecklist()
    },[])
    
    return (
        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={clearModalVisible}
                onRequestClose={() => {
                  //Alert.alert("Modal has been closed.");
                  setClearModalVisible(!clearModalVisible)
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Deseja realmente limpar os dados Coletados?:</Text>
                        <View style={styles.modalButtonsContainer}>
                            <Pressable
                                style={[styles.button, styles.buttonConfirm]}
                                onPress={() => {
                                    // --------------- Handle Request to BackEnd
                                    clearCollection()
                                }}
                                >
                                {loading?
                                    <ActivityIndicator animating={loading} size="large" color="#fff"/>
                                :
                                    <Text style={styles.modalButtonTextStyle}>Limpar</Text>
                                }
                            </Pressable>
                            <Pressable
                                style={[styles.button, styles.buttonCancel]}
                                onPress={() => setClearModalVisible(!clearModalVisible)}
                                >
                                <Text style={styles.modalButtonTextStyle}>Cancelar</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
            <Header />
            <View style={styles.backSearch}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <AntDesign name="leftcircle" size={40} color='#80808070' />
                </TouchableOpacity>
                <View style={styles.input}>
                    <Image 
                        source={require('../../../assets/Lupa_BarraDePesquisa.png')} 
                        resizeMode= 'cover'
                        style={{height: '100%'}}
                    />
                    <TextInput 
                        style={styles.inputText} 
                        placeholder={'Pesquise o Produto'}
                        onChangeText={ subStringItem => {
                            setListItems(checkListItems.filter( item => {
                                return item.itemCategory.toLowerCase().includes(subStringItem.toLowerCase())
                            }))
                            return
                        }}
                    />
                </View>
            </View>
            <ScrollView style={styles.scrollContainer}>
            {
                    listItems.map( (item,index) => {
                        return(
                            <View key={index} style={
                                index === 0 ?
                                    (currentIndex === index)?
                                        [styles.itemContainer, {borderTopLeftRadius: 21, borderTopRightRadius: 21, marginBottom: '5%'}]
                                    :
                                        [styles.itemContainer, {borderTopLeftRadius: 21, borderTopRightRadius: 21}]
                                :
                                    (checkListItems.length-1) === index ?
                                        (currentIndex === index)?
                                            [styles.itemContainer, {borderTopLeftRadius: 21, borderTopRightRadius: 21, marginTop: '5%'}]
                                        :
                                            [styles.itemContainer, {borderBottomLeftRadius: 21, borderBottomRightRadius: 21}]
                                    :
                                        (currentIndex === index)?
                                            [styles.itemContainer, {borderTopLeftRadius: 21, borderTopRightRadius: 21, marginTop: '5%', marginBottom: '5%'}]
                                        :
                                            styles.itemContainer
                            }>
                                <TouchableOpacity style={styles.itemTouchable} onPress={() => {
                                        setCurrentIndex(index)  
                                    }}>
                                    <View style={styles.checkBoxContainer}>
                                        {
                                            item.coletado?
                                            <Image 
                                                source={require('../../../assets/checkedBox.png')} 
                                            /> :
                                            <Image 
                                                source={require('../../../assets/uncheckedBox.png')}
                                            />
                                        }
                                    </View>
                                    <View style={styles.textContainer}>
                                        <Text style={[styles.itemTitle,]}>
                                            {item.nome}
                                        </Text>
                                        <Text style={styles.itemSubtext}>
                                            {item.marca}
                                        </Text>
                                        <Text style={styles.itemSubtext}>
                                            {item.nomeLoja}
                                        </Text>
                                    </View>
                                    <View style={styles.priceContainer}>
                                        <Text style={styles.itemPrice}>
                                            R$ {item.preço ? item.preço.toFixed(2).replace('.',',') : '--'}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                {
                                    index === currentIndex ?
                                        item.coletado ?
                                            <View style={styles.itemButtons}>
                                                <TouchableOpacity style={styles.clearButton} onPress={() => setClearModalVisible(!clearModalVisible)}>
                                                    <Text style={styles.textButton}>Limpar</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={styles.editButton} onPress={() => {
                                                    navigation.push('SendPic', item)
                                                }}>
                                                    <Text style={styles.textButton}>Editar</Text>
                                                </TouchableOpacity>
                                            </View>
                                        :
                                            <View style={styles.itemButtons}>
                                                <TouchableOpacity style={styles.collectButton} onPress={() => {
                                                    navigation.push('SendPic', item)
                                                }}>
                                                    <Text style={styles.textButton}>Coletar</Text>
                                                </TouchableOpacity>
                                            </View>
                                    :
                                    undefined
                                }
                            </View>
                        )
                    })
                }
            </ScrollView>
        </View>
    );
}

export default CheckList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        paddingHorizontal: '3%',
        flex: 1,
    },
    text: {
        fontSize: 42,
    },
    backSearch: {
        height: 80,
        flexDirection: 'row',
        alignItems: 'center',
        // borderColor: '#000',
        // borderWidth: 5,
    },
    input: {
        // flex: 1,
        flexDirection: 'row',
        // alignSelf: 'center',
        height: 50,
        width: '80%',
        marginLeft: '5%',
        borderWidth: 1,
        borderColor: '#86868688',
        borderRadius: 10,
    },
    inputText: {
        height: '100%',
        width: '100%',
        fontSize: 27,
        marginLeft: '2%'
    },
    backButton: {
        // alignSelf: 'center',
        elevation: 3,
        marginLeft: '2%'
    },
    itemContainer: {
        flex: 1,
        borderColor: '#CCCCCC',
        borderWidth: 2,
    },
    itemTouchable: {
        flexDirection: 'row',
        paddingVertical: '3%'
    },
    checkBoxContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1 
    },
    textContainer: {
        flex: 3,
    },
    priceContainer: {
        flex: 3,
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
    itemPrice: {
        fontSize: 37.61,
        lineHeight: 45.85,
        fontWeight: 'bold',
        color: '#352727'
    },
    itemButtons: {
        flexDirection: 'row',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40
    },
    clearButton: {
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
    collectButton: {
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
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center",
        color: '#352727',
        fontWeight: '400',
        fontSize: 21
      },
      buttonConfirm: {
        backgroundColor: "#A60A0A",
      },
      buttonCancel: {
        backgroundColor: "#4FAE2D",
      },
      modalButtonTextStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 21,
        fontWeight: '700',
        marginHorizontal: 15
      },
      button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
      },
      modalButtonsContainer: {
        flexDirection: 'row',
        // borderColor: '#000',
        // borderWidth: 2,
        width: 280,
        justifyContent: 'space-between'
      }
})