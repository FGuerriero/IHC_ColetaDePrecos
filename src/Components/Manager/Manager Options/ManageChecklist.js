import React, {useEffect, useState} from 'react';
import { Text, StyleSheet, TouchableOpacity, View, Image, ScrollView, TextInput, Modal, Pressable, DeviceEventEmitter, Alert,
    ActivityIndicator
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import {db,collection, getDocs,addDoc,doc,query,where,deleteDoc} from "../../../config/firebase.js";

import Header from '../../Header/Header';

// const filteredRef = query(
//     collection(db,"Usuarios"),
//     where(`recipiant`, "==", `${searchValue}`)
//   );

function ManageChecklists({route, navigation}) {
    const [checklistsAll, setChecklistsAll] = useState([
        {
            id: 'asdsd',
            lojaNome: 'Extra Pirituba',
            lojaId: '',
            dataColeta: '22/12/2022',
            status: 'Concluida'
        },{
            id: 'asdsd',
            lojaNome: 'Carrefour Pirituba',
            lojaId: '',
            dataColeta: '03/01/2023',
            status: 'Pendente'
        }
    ])
    const [listItems, setListItems] = useState(checklistsAll)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [deleteModalVisible, setDeleteModalVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [searchText, setSearchText] = useState('')

    // const updateUsers = () => {
    //     getDocs(collection(db, "Usuarios")).then( async (snapShot) => {
    //         const usersColl = snapShot.docs.map((doc,index) => {
    //             //index === 0 ?console.log("ID"+index+": ", doc._document.key.path) : undefined
    //             return {...doc.data(), id: doc._document.key.path.segments.pop()}
    //         })
    //         //console.log("Users: ", usersColl)
            
    //         usersColl.sort( SortArrayObj )
    //         setSearchText('')
    //         setChecklistsAll(usersColl)
    //         setListItems(usersColl)

    //     })
    //     return
    // }

    // const deleteUser = () => {
    //     setLoading(true)
    //     deleteDoc(doc(db,"Usuarios",listItems[currentIndex].id)).then((resp) => {
    //         console.log("Deleted: ", resp)
    //         Alert.alert("Usuário excluido com sucesso!")
    //         //updateUsers()
    //         setDeleteModalVisible(!deleteModalVisible)
    //         setLoading(false)
    //     }).catch((error) => {
    //         Alert.alert("Erro o tentar deletar Usuário!\n",error)
    //     })
    // }

    function SortArrayObj(a, b) {
        const nameA = a.lojaNome.toUpperCase(); // ignore upper and lowercase
        const nameB = b.lojaNome.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
      
        // names must be equal
        return 0;
    }

    useEffect(() => {
        //console.log("UseEffect")
        //updateUsers()
        //------------------- Date to String -----------------------------
        // let date = new Date()
        // console.log("Date: ", typeof date.toISOString().split('T')[0])

        DeviceEventEmitter.addListener("event.userUpdated", () => {
            console.log("Edited User")
            //updateUsers()
        });
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
                        <Text style={styles.modalText}>Deseja realmente deletar o Usuário?:</Text>
                        <Text style={styles.modalStoreText}>{listItems[currentIndex] ? listItems[currentIndex].lojaNome : undefined}, {listItems[currentIndex] ? listItems[currentIndex].tipo : undefined} </Text>
                        <View style={styles.modalButtonsContainer}>
                            <Pressable
                                style={[styles.button, styles.buttonConfirm]}
                                onPress={() => {
                                    // --------------- Handle Request to BackEnd
                                    deleteUser()
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
                <View style={styles.userNameContainer}>
                    <Text style={styles.userNameText}>{route.params.nome}</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.btnNovoProduto} onPress={ () => navigation.push('ChecklistCRUD')}>
                <Text style={styles.txtNovoProduto}>NOVA LISTA</Text>
            </TouchableOpacity>
            {
                checklistsAll[0].id == "" ?
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
                                            (listItems.length-1) === index ?
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
                                                    item.status == 'Concluida'?
                                                    <Image 
                                                        source={require('../../../../assets/checkedBox.png')} 
                                                    /> :
                                                    <Image 
                                                        source={require('../../../../assets/uncheckedBox.png')}
                                                    />
                                                }
                                            </View>
                                            <View style={styles.textContainer}>
                                                <Text style={[styles.itemTitle,]}>
                                                    {item.lojaNome}
                                                </Text>
                                                <Text style={styles.itemSubtext}>
                                                    {item.dataColeta}
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
                                                            console.log("Editando: ", item)
                                                            navigation.push('UsersCRUD', item)
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

export default ManageChecklists;

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
    userNameContainer: {
        flexDirection: 'row',
        height: '65%',
        width: '80%',
        marginLeft: '5%',
        // borderColor: '#000',
        // borderWidth: 1
    },
    userNameText: {
        height: '100%',
        width: '100%',
        fontSize: 27,
        marginLeft: '2%',
        fontSize: 30,
        fontWeight: '900',
        marginTop: '1.5%'
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
        paddingVertical: '5%'
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
    checkistButton: {
        backgroundColor: '#730606',
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
      },
      checkBoxContainer: {
          justifyContent: 'center',
          alignItems: 'center',
          flex: .5,
          marginLeft: '3%' 
      }
})