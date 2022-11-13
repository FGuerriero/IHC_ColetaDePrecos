import React, {useState, useEffect} from 'react';
import { Text, StyleSheet, TouchableOpacity, View, Image, ScrollView, TextInput, Modal, Alert, Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import Header from '../Header/Header';

const checkListItems = [
    {
        id: 1,
        itemCategory: 'Maionese',
        itemBrand: 'My Oh Nese!',
        storeName: 'Carrefour Pirituba',
        itemPrice: 5.6,
        collected: true,
        itemBarCode: '@#45wkm@#$%tQç.tvWk4p',
        url: 'https://uploads.metropoles.com/wp-content/uploads/2022/02/18191800/produtos-supermecado-o-dia-715x1024.jpg'
    },{
        id: 2,
        itemCategory: 'Feijão',
        itemBrand: 'Camil',
        storeName: 'Carrefour Pirituba',
        itemPrice: null,
        collected: false,
        itemBarCode: null,
        url: 'https://www.paodeacucar.com/img/uploads/1/29/10519029.jpeg'
    },{
        id: 3,
        itemCategory: 'Arroz',
        itemBrand: 'Prato Fino',
        storeName: 'Carrefour Anhanguera',
        itemPrice: 12.99,
        collected: true,
        itemBarCode: '@#45wkm@#$%tQç.tvWk4p',
        url: 'https://bighiper.vtexassets.com/arquivos/ids/167874/image789629030001-1.jpg?v=637392392303730000'
    },{
        id: 4,
        itemCategory: 'Macarrão',
        itemBrand: 'Renata',
        storeName: 'Extra Lapa',
        itemPrice: 2.50,
        collected: true,
        itemBarCode: '@#45wkm@#$%tQç.tvWk4p',
        url: 'https://carrefourbr.vtexassets.com/arquivos/ids/195563/220930_5.jpg?v=637272435428070000'
    },{
        id: 1,
        itemCategory: 'Maionese',
        itemBrand: 'My Oh Nese!',
        storeName: 'Carrefour Pirituba',
        itemPrice: 5.6,
        collected: true,
        itemBarCode: '@#45wkm@#$%tQç.tvWk4p',
        url: 'https://uploads.metropoles.com/wp-content/uploads/2022/02/18191800/produtos-supermecado-o-dia-715x1024.jpg'
    },{
        id: 2,
        itemCategory: 'Feijão',
        itemBrand: 'Camil',
        storeName: 'Carrefour Pirituba',
        itemPrice: null,
        collected: false,
        itemBarCode: null,
        url: 'https://www.paodeacucar.com/img/uploads/1/29/10519029.jpeg'
    },{
        id: 3,
        itemCategory: 'Arroz',
        itemBrand: 'Prato Fino',
        storeName: 'Carrefour Anhanguera',
        itemPrice: 12.99,
        collected: true,
        itemBarCode: '@#45wkm@#$%tQç.tvWk4p',
        url: 'https://bighiper.vtexassets.com/arquivos/ids/167874/image789629030001-1.jpg?v=637392392303730000'
    },{
        id: 4,
        itemCategory: 'Macarrão',
        itemBrand: 'Renata',
        storeName: 'Extra Lapa',
        itemPrice: 2.50,
        collected: true,
        itemBarCode: '@#45wkm@#$%tQç.tvWk4p',
        url: 'https://carrefourbr.vtexassets.com/arquivos/ids/195563/220930_5.jpg?v=637272435428070000'
    },{
        id: 1,
        itemCategory: 'Maionese',
        itemBrand: 'My Oh Nese!',
        storeName: 'Carrefour Pirituba',
        itemPrice: 5.6,
        collected: true,
        itemBarCode: '@#45wkm@#$%tQç.tvWk4p',
        url: 'https://uploads.metropoles.com/wp-content/uploads/2022/02/18191800/produtos-supermecado-o-dia-715x1024.jpg'
    },{
        id: 2,
        itemCategory: 'Feijão',
        itemBrand: 'Camil',
        storeName: 'Carrefour Pirituba',
        itemPrice: null,
        collected: false,
        itemBarCode: null,
        url: 'https://www.paodeacucar.com/img/uploads/1/29/10519029.jpeg'
    },{
        id: 3,
        itemCategory: 'Arroz',
        itemBrand: 'Prato Fino',
        storeName: 'Carrefour Anhanguera',
        itemPrice: 12.99,
        collected: true,
        itemBarCode: '@#45wkm@#$%tQç.tvWk4p',
        url: 'https://bighiper.vtexassets.com/arquivos/ids/167874/image789629030001-1.jpg?v=637392392303730000'
    },{
        id: 4,
        itemCategory: 'Macarrão',
        itemBrand: 'Renata',
        storeName: 'Extra Lapa',
        itemPrice: 2.50,
        collected: true,
        itemBarCode: '@#45wkm@#$%tQç.tvWk4p',
        url: 'https://carrefourbr.vtexassets.com/arquivos/ids/195563/220930_5.jpg?v=637272435428070000'
    },{
        id: 1,
        itemCategory: 'Maionese',
        itemBrand: 'My Oh Nese!',
        storeName: 'Carrefour Pirituba',
        itemPrice: 5.6,
        collected: true,
        itemBarCode: '@#45wkm@#$%tQç.tvWk4p',
        url: 'https://uploads.metropoles.com/wp-content/uploads/2022/02/18191800/produtos-supermecado-o-dia-715x1024.jpg'
    },{
        id: 2,
        itemCategory: 'Feijão',
        itemBrand: 'Camil',
        storeName: 'Carrefour Pirituba',
        itemPrice: null,
        collected: false,
        itemBarCode: null,
        url: 'https://www.paodeacucar.com/img/uploads/1/29/10519029.jpeg'
    },{
        id: 3,
        itemCategory: 'Arroz',
        itemBrand: 'Prato Fino',
        storeName: 'Carrefour Anhanguera',
        itemPrice: 12.99,
        collected: true,
        itemBarCode: '@#45wkm@#$%tQç.tvWk4p',
        url: 'https://bighiper.vtexassets.com/arquivos/ids/167874/image789629030001-1.jpg?v=637392392303730000'
    },{
        id: 4,
        itemCategory: 'Macarrão',
        itemBrand: 'Renata',
        storeName: 'Extra Lapa',
        itemPrice: 2.50,
        collected: true,
        itemBarCode: '@#45wkm@#$%tQç.tvWk4p',
        url: 'https://carrefourbr.vtexassets.com/arquivos/ids/195563/220930_5.jpg?v=637272435428070000'
    },
]

function CheckList({navigation}) {
    const [listItems, setListItems] = useState(checkListItems)
    const [currentIndex, setCurrentIndex] = useState(null)
    const [clearModalVisible, setClearModalVisible] = useState(false)
    
    return (
        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={clearModalVisible}
                onRequestClose={() => {
                  Alert.alert("Modal has been closed.");
                  setClearModalVisible(!clearModalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Deseja realmente limpar os dados Coletados?</Text>
                        <View style={styles.modalButtonsContainer}>
                            <Pressable
                                style={[styles.button, styles.buttonConfirm]}
                                onPress={() => {
                                    // --------------- Handle Request to BackEnd
                                    setClearModalVisible(!clearModalVisible)
                                }}
                                >
                                <Text style={styles.modalButtonTextStyle}>Limpar</Text>
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
            <Header/>
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
                                <TouchableOpacity style={styles.itemTouchable} onPress={() => {setCurrentIndex(index)}}>
                                    <View style={styles.checkBoxContainer}>
                                        {
                                            item.collected?
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
                                            {item.itemCategory}
                                        </Text>
                                        <Text style={styles.itemSubtext}>
                                            {item.itemBrand}
                                        </Text>
                                        <Text style={styles.itemSubtext}>
                                            {item.storeName}
                                        </Text>
                                    </View>
                                    <View style={styles.priceContainer}>
                                        <Text style={styles.itemPrice}>
                                            R$ {item.itemPrice ? item.itemPrice.toFixed(2).replace('.',',') : '--'}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                {
                                    index === currentIndex ?
                                        item.collected ?
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