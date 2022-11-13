import React, {useState} from 'react';
import { Text, StyleSheet, TouchableOpacity, View, Image, ScrollView, TextInput } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import Header from '../../Header/Header';

const productsList = [
    {
        productType: 'Maionese',
        productBrand: 'My Oh Nese!',
        productDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo cons'
    },{
        productType: 'Feijão',
        productBrand: 'Camil',
        productDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo cons'
    },{
        productType: 'Feijão',
        productBrand: 'Kicaldo',
        productDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo cons'
    },{
        productType: 'Arroz',
        productBrand: 'Prato Fino',
        productDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo cons'
    },{
        productType: 'Arroz',
        productBrand: 'Camil',
        productDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo cons'
    },{
        productType: 'Macarrão',
        productBrand: 'Renata',
        productDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo cons'
    },{
        productType: 'Macarrão',
        productBrand: 'Dona Benta',
        productDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo cons'
    },
]

function Products({navigation}) {
    const [listItems, setListItems] = useState(productsList)
    const [currentIndex, setCurrentIndex] = useState(null)
    const [clearModalVisible, setClearModalVisible] = useState(false)


    return (
        
        <View style={styles.container}>
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
                        placeholder={'Pesquise o Produto'}
                        onChangeText={ subStringItem => {
                            setListItems(productsList.filter( item => {
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
                                    (productsList.length-1) === index ?
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
                                                source={require('../../../../assets/checkedBox.png')} 
                                            /> :
                                            <Image 
                                                source={require('../../../../assets/uncheckedBox.png')}
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

export default Products;

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
    }
})