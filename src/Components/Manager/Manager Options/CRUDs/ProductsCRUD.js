import React, {useEffect, useState} from 'react';
import { Text, StyleSheet, View, TextInput, Modal, Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker'
import Header from '../../../Header/Header';

const BRANDS = ['Camil', 'Kicaldo', 'Prato Fino', 'Dona Benta', 'Renata', 'Parmalate', 'My Oh Nese!']

function ProductsCRUD({route, navigation}) {
    const [productName, setProductName] = useState(null)
    const [productBrand, setProductBrand] = useState(null)
    const [productDescription, setProductDescription] = useState(null)

    useEffect(() => {
        if(route.params){
            setProductName(route.params.productType)
            setProductBrand(route.params.productBrand)
            setProductDescription(route.params.productDescription)
        }
    }, [])

    return(
        <View style={styles.container}>
            <Header />
            <View style={styles.btnBackContainer}>
                <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                    <AntDesign name="leftcircle" size={40} color='#80808070' />
                </Pressable>
            </View>
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
                        <Picker.Item label='Selecione Produto' value={null} key={0}/>
                        {
                            BRANDS.map((item, index) => {
                                return (
                                    <Picker.Item label={item} value={item} key={index+1} />
                                )
                            })
                        }
                    </Picker>
                </View>
                <TextInput 
                    style={styles.inputTextDescription} 
                    placeholder={'Descrição do Produto'}
                    onChangeText={ text => setProductName(text)}
                    value={productDescription}
                    multiline={true}
                />
                <Pressable style={styles.btnGravar}>
                    <Text style={styles.txtBtnGravar}>GRAVAR</Text>
                </Pressable>
            </View>
        </View>
    )
}

export default ProductsCRUD;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    btnBackContainer: {
        height: '10%',
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
        marginHorizontal: '3%'
    },
    inputText: {
        //height: '100%',
        width: '100%',
        fontSize: 27,
        marginLeft: '2%',
        borderColor: '#868686',
        borderWidth: 2,
        borderRadius: 9.5,
        flex: .1
    },
    inputTextDescription: {
        width: '100%',
        fontSize: 27,
        marginLeft: '2%',
        borderColor: '#868686',
        borderWidth: 2,
        borderRadius: 9.5,
        flex: .45
    },
    pickerContainer: {
        height: '10%',
        borderColor: '#868686',
        borderWidth: 2,
        width:'100%',
        borderRadius: 9.5,
        marginVertical: '10%'
    },
    picker: {
        fontSize: 30,
    },
    btnGravar: {
        backgroundColor: '#A60A0A',
        margin: '5%',
        height: '5%',
        justifyContent: 'center',
        flex: 0.1,
        width: '100%',
        marginTop: '30%'
    },
    txtBtnGravar: {
        fontSize: 19.76,
        fontWeight: '700',
        alignSelf: 'center',
        color: '#fff'
    }
})