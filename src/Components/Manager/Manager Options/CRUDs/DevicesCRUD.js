import React, {useEffect, useState} from 'react';
import { Text, StyleSheet, View, TextInput, Modal, TouchableOpacity, ActivityIndicator, DeviceEventEmitter, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker'
import Header from '../../../Header/Header';

const USERS = ['Fernando G', 'Juliana C', 'Jushara S', 'Fagner A', 'Matheus G', 'Fernando Guerriero', 'Juliana Cruz', 'Anthony Castro']

function StoresCRUD({route, navigation}) {
    const [nickName, setNickName] = useState(null)
    const [brand, setBrand] = useState(null)
    const [model, setModel] = useState(null)
    const [addressMAC, setAddressMAC] = useState(null)
    const [sponsor, setSponsor] = useState(null)

    const [loadVisible, setLoadVisible] = useState(false)

    const GravarDevice = () => {
        setLoadVisible(true)
        setTimeout(() => {
            setLoadVisible(false)
            navigation.goBack()
            //---------------Tratativa de Resposta da API: -----------

            //-----------SUCCESS-------------------
            // DeviceEventEmitter.emit("event.productSavedResponse", 'success')

            //-----------ERROR--------------------
            //DeviceEventEmitter.emit("event.deviceSavedResponse", 'fail')
            Alert.alert("Falha ao tentar gravar Dispositivo!! \n Tente novamente mais tarde.")

        },1000)
        return
    }

    useEffect(() => {
        if(route.params){
            setNickName(route.params.deviceNickname)
            setBrand(route.params.deviceBrand)
            setModel(route.params.deviceModel)
            setAddressMAC(route.params.deviceMAC)
            setSponsor(route.params.deviceSponsor)
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
                    placeholder={'Nome do Device'}
                    value={nickName}
                    onChangeText={ text => setNickName(text)}
                />
                <TextInput 
                    style={styles.inputText} 
                    placeholder={'Marca'}
                    value={brand}
                    onChangeText={ text => setBrand(text)}
                />
                <TextInput 
                    style={styles.inputText} 
                    placeholder={'Modelo'}
                    value={model}
                    onChangeText={ text => setModel(text)}
                />
                <TextInput 
                    style={styles.inputText} 
                    placeholder={'MAC address'}
                    value={addressMAC}
                    onChangeText={ text => setAddressMAC(text)}
                />
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={sponsor}
                        onValueChange={newValue => setSponsor(newValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label='Selecione Responsável' value={null} key={0} style={styles.pickerItemGrey}/>
                        {
                            USERS.map((item, index) => {
                                return (
                                    <Picker.Item label={item} value={item} key={index+1} style={styles.pickerItemBlack} />
                                )
                            })
                        }
                    </Picker>
                </View>
                <TouchableOpacity style={styles.btnGravar} onPress={() => GravarDevice()}>
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
        //height: '11%',
        borderColor: '#868686',
        borderWidth: 2,
        width:'100%',
        borderRadius: 9.5,
        //marginVertical: '10%'
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
    },
})