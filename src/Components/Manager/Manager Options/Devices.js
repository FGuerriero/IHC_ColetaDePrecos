import React, {useState} from 'react';
import { Text, StyleSheet, TouchableOpacity, View, Image, ScrollView, TextInput, Modal, Pressable, DeviceEventEmitter, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import Header from '../../Header/Header';

const devicesList = [
    {
        deviceNickname: 'Motorola 01',
        deviceBrand: 'Motorola',
        deviceModel: 'E7 Plus',
        deviceMAC: '0F:AC:FF:04:50:01',
        deviceSponsor: 'Fernando Guerriero'
    },
    {
        deviceNickname: 'Motorola 02',
        deviceBrand: 'Motorola',
        deviceModel: 'G5 Mini',
        deviceMAC: '0F:AC:FF:04:50:01',
        deviceSponsor: 'Juliana Cruz'
    },
    {
        deviceNickname: 'Xiaomi 01',
        deviceBrand: 'Xiaomi',
        deviceModel: 'Mi11',
        deviceMAC: '0F:AC:FF:04:50:01',
        deviceSponsor: 'Anthony Castro'
    },
    {
        deviceNickname: 'Motorola 01',
        deviceBrand: 'Motorola',
        deviceModel: 'E7 Plus',
        deviceMAC: '0F:AC:FF:04:50:01',
        deviceSponsor: 'Fernando Guerriero'
    },
    {
        deviceNickname: 'Motorola 02',
        deviceBrand: 'Motorola',
        deviceModel: 'G5 Mini',
        deviceMAC: '0F:AC:FF:04:50:01',
        deviceSponsor: 'Juliana Cruz'
    },
    {
        deviceNickname: 'Xiaomi 01',
        deviceBrand: 'Xiaomi',
        deviceModel: 'Mi11',
        deviceMAC: '0F:AC:FF:04:50:01',
        deviceSponsor: 'Anthony Castro'
    },
    {
        deviceNickname: 'Motorola 01',
        deviceBrand: 'Motorola',
        deviceModel: 'E7 Plus',
        deviceMAC: '0F:AC:FF:04:50:01',
        deviceSponsor: 'Fernando Guerriero'
    },
    {
        deviceNickname: 'Motorola 02',
        deviceBrand: 'Motorola',
        deviceModel: 'G5 Mini',
        deviceMAC: '0F:AC:FF:04:50:01',
        deviceSponsor: 'Juliana Cruz'
    },
    {
        deviceNickname: 'Xiaomi 01',
        deviceBrand: 'Xiaomi',
        deviceModel: 'Mi11',
        deviceMAC: '0F:AC:FF:04:50:01',
        deviceSponsor: 'Anthony Castro'
    },
]

function Devices({navigation}) {
    const [listItems, setListItems] = useState(devicesList)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [deleteModalVisible, setDeleteModalVisible] = useState(false)
    
    const [nickName, setNickName] = useState(null)
    const [brand, setBrand] = useState(null)
    const [model, setModel] = useState(null)
    const [addressMAC, setAddressMAC] = useState(null)
    const [sponsor, setSponsor] = useState(null)

    DeviceEventEmitter.addListener("event.deviceSavedResponse", (apiResponse) => {
        if(apiResponse==='success'){
            Alert.alert("Dados gravados com sucesso!")
        }else if(apiResponse==='fail'){
            Alert.alert("Falha ao tentar gravar Dispositivo!! \n Tente novamente mais tarde.")
        }
        // setTimeout(() => {
        // }, 3000)
    });

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
                        <Text style={styles.modalProductText}>{currentIndex ? devicesList[currentIndex].deviceNickname : undefined}, {currentIndex ? devicesList[currentIndex].deviceSponsor : undefined} </Text>
                        <View style={styles.modalButtonsContainer}>
                            <Pressable
                                style={[styles.button, styles.buttonConfirm]}
                                onPress={() => {
                                    // --------------- Handle Request to BackEnd
                                    setDeleteModalVisible(!deleteModalVisible)
                                }}
                                >
                                <Text style={styles.modalButtonTextStyle}>Deletar</Text>
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
                        onChangeText={ subStringItem => {
                            setListItems(devicesList.filter( item => {
                                return item.storeName.toLowerCase().includes(subStringItem.toLowerCase())
                            }))
                            return
                        }}
                    />
                </View>
            </View>
            <TouchableOpacity style={styles.btnNovoProduto} onPress={ () => navigation.push('DevicesCRUD')}>
                <Text style={styles.txtNovoProduto}>NOVO DEVICE</Text>
            </TouchableOpacity>
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
                                <TouchableOpacity style={styles.itemTouchable} onPress={() => {setCurrentIndex(index)}}>
                                    <View style={styles.textContainer}>
                                        <Text style={[styles.itemTitle,]}>
                                            {item.deviceNickname}
                                        </Text>
                                        <Text style={styles.itemSubtext}>
                                            {item.deviceBrand}
                                        </Text>
                                        <Text style={styles.itemSubtext}>
                                            {item.deviceModel}
                                        </Text>
                                        <Text style={styles.itemSubtext}>
                                            {item.deviceSponsor}
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
        height: '10%',
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
        height: '5%',
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
      modalProductText: {
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
      }
})