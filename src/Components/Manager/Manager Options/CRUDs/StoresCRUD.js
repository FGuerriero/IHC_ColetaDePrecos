import React, {useEffect, useState} from 'react';
import { Text, StyleSheet, View, TextInput, Modal, TouchableOpacity, ActivitstoreNameyIndicator, DeviceEventEmitter, ActivityIndicator } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Header from '../../../Header/Header';

function StoresCRUD({route, navigation}) {
    const [storeName, setStoreName] = useState(null)
    const [franchise, setFranchise] = useState(null)
    const [address, setAddress] = useState(null)
    const [loadVisible, setLoadVisible] = useState(false)

    const GravarLoja = () => {
        setLoadVisible(true)
        setTimeout(() => {
            setLoadVisible(false)
            navigation.goBack()
            //---------------Tratativa de Resposta da API: -----------

            //-----------SUCCESS-------------------
            // DeviceEventEmitter.emit("event.productSavedResponse", 'success')

            //-----------ERROR--------------------
            DeviceEventEmitter.emit("event.storeSavedResponse", 'fail')

        },1000)
        return
    }

    useEffect(() => {
        if(route.params){
            setStoreName(route.params.storeName)
            setFranchise(route.params.franchise)
            setAddress(route.params.fullAddress)
        }
    }, [])

    return(
        <View style={styles.container}>
            <Header />
            <View style={styles.btnBackContainer}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <AntDesign name="leftcircle" size={40} color='#80808070' />
                </TouchableOpacity>
            </View>
            <View style={styles.bodyContainer}>
                <TextInput 
                    style={styles.inputText} 
                    placeholder={'Nome da Loja'}
                    value={storeName}
                    onChangeText={ text => setStoreName(text)}
                />
                <TextInput 
                    style={styles.inputText} 
                    placeholder={'Franquia'}
                    value={franchise}
                    onChangeText={ text => setFranchise(text)}
                />
                <TextInput 
                    style={styles.inputTextDescription} 
                    placeholder={'Endereço completo'}
                    onChangeText={ text => setAddress(text)}
                    value={address}
                    multiline={true}
                />
                <TouchableOpacity style={styles.btnGravar} onPress={() => GravarLoja()}>
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

export default StoresCRUD;

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
        marginBottom: '5%',
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
        height: '11%',
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
        height: '5%',
        justifyContent: 'center',
        flex: 0.14,
        width: '100%',
        marginTop: '30%'
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
    }
})