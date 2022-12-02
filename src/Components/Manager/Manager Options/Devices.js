import React, {useState, useEffect} from 'react';
import { Text, StyleSheet, TouchableOpacity, View, Image, ScrollView, TextInput, Modal, Pressable, DeviceEventEmitter, Alert,
    ActivityIndicator  
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import {db,collection, getDocs,addDoc,doc,query,where,deleteDoc} from "../../../config/firebase.js";

import Header from '../../Header/Header';


function Devices({navigation}) {
    const [devicesList,setDevicesList] = useState([
        {
            nome: '',
            marca: '',
            modelo: '',
            endereçoMAC: '',
            usuarioResponsavel: ''
        }
    ])
    const [listItems, setListItems] = useState(devicesList)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [deleteModalVisible, setDeleteModalVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [searchText, setSearchText] = useState('')

    function SortArrayObj(a, b) {
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
    }

    const updateDevices = () => {
        getDocs(collection(db, "Dispositivos")).then( async (snapShot) => {
            const devicesColl = snapShot.docs.map((doc,index) => {
                //index === 0 ?console.log("ID"+index+": ", doc._document.key.path) : undefined
                return {...doc.data(), id: doc._document.key.path.segments.pop()}
            })
            //console.log("Produtos: ", devicesColl)
            
            devicesColl.sort( SortArrayObj )
            setDevicesList(devicesColl)
            setListItems(devicesColl)
            setSearchText('')

        })
        return
    }

    const deleteDevice = () => {
        setLoading(true)
        deleteDoc(doc(db,"Dispositivos",listItems[currentIndex].id)).then((resp) => {
            console.log("Deleted: ", resp)
            Alert.alert("Dispositivo excluido com sucesso!")
            updateDevices()
            setDeleteModalVisible(!deleteModalVisible)
            setLoading(false)
            setCurrentIndex(0)
        }).catch((error) => {
            Alert.alert("Erro o tentar deletar Dispositivo!\n",error)
        })
    }

    useEffect(() => {
        //console.log("UseEffect")
        updateDevices()

        DeviceEventEmitter.addListener("event.deviceUpdated", () => {
            console.log("Edited Device!")
            updateDevices()
        });
        console.log("UseEffect")
    },[])

    return (
        
        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={deleteModalVisible}
                onRequestClose={() => {
                  //Alert.alert("Modal has been closed.");
                  setDeleteModalVisible(!deleteModalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Deseja realmente deletar o Dispositivo?:</Text>
                        <Text style={styles.modalStoreText}>{devicesList[currentIndex] ? devicesList[currentIndex].nome : undefined}, {devicesList[currentIndex] ? devicesList[currentIndex].usuarioResponsavel : undefined} </Text>
                        <View style={styles.modalButtonsContainer}>
                            <Pressable
                                style={[styles.button, styles.buttonConfirm]}
                                onPress={() => {
                                    // --------------- Handle Request to BackEnd
                                    deleteDevice()
                                }}
                            >
                                {loading?
                                    <ActivityIndicator animating={loading} size="large" color="#fff"/>
                                :
                                    <Text style={styles.modalButtonTextStyle}>Deletar</Text>
                                }
                            </Pressable>
                            <Pressable
                                style={[styles.button, styles.buttonCancel]}
                                onPress={() => setDeleteModalVisible(!deleteModalVisible)}
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
                        source={require('../../../../assets/Lupa_BarraDePesquisa.png')} 
                        resizeMode= 'cover'
                        style={{height: '100%'}}
                    />
                    <TextInput 
                        style={styles.inputText} 
                        placeholder={'Pesquise o Device'}
                        value={searchText}
                        onChangeText={ subStringItem => {
                            setSearchText(subStringItem)
                            setListItems(devicesList.filter( item => {
                                return item.nome.toLowerCase().includes(subStringItem.toLowerCase())
                            }))
                            return
                        }}
                    />
                </View>
            </View>
            <TouchableOpacity style={styles.btnNovoProduto} onPress={ () => navigation.push('DevicesCRUD')}>
                <Text style={styles.txtNovoProduto}>NOVO DISPOSITIVO</Text>
            </TouchableOpacity>
            {
                devicesList[0].nome == "" ?
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
                                            (currentIndex === index)?
                                                [styles.itemContainer, {borderTopLeftRadius: 21, borderTopRightRadius: 21, marginBottom: '5%'}]
                                            :
                                                [styles.itemContainer, {borderTopLeftRadius: 21, borderTopRightRadius: 21}]
                                        :
                                            (devicesList.length-1) === index ?
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
                                            <View style={styles.textContainer}>
                                                <Text style={[styles.itemTitle,]}>
                                                    {item.nome}
                                                </Text>
                                                <Text style={styles.itemSubtext}>
                                                    {item.marca}
                                                </Text>
                                                <Text style={styles.itemSubtext}>
                                                    {item.modelo}
                                                </Text>
                                                <Text style={styles.itemSubtext}>
                                                    {item.usuarioResponsavel}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                        {
                                            index === currentIndex ?
                                                    <View style={styles.itemButtons}>
                                                        <TouchableOpacity style={styles.deleteButton} onPress={() => setDeleteModalVisible(!deleteModalVisible)}>
                                                            <Text style={styles.textButton}>Deletar</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={styles.editButton} onPress={() => {
                                                            navigation.push('DevicesCRUD', item)
                                                        }}>
                                                            <Text style={styles.textButton}>Editar</Text>
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
            }
        </View>
    );
}

export default Devices;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        paddingHorizontal: '3%'
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
        height: '65%',
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
    itemDescription : {
        fontSize: 11,
        lineHeight: 16.4,
        fontWeight: '400',
        color: '#6F5F5F'
    },
    btnNovoProduto: {
        backgroundColor: '#A60A0A',
        margin: '5%',
        height: 45,
        justifyContent: 'center'
    },
    txtNovoProduto: {
        fontSize: 19.76,
        fontWeight: '700',
        alignSelf: 'center',
        color: '#fff'
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
      modalStoreText: {
        marginBottom: 15,
        textAlign: "center",
        color: '#352727',
        fontWeight: 'bold',
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
      },
      activeIndicator: {
        height: '40%',
        paddingTop: '10%'
      }
})