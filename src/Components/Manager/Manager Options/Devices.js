import React, {useState} from 'react';
import { Text, StyleSheet, TouchableOpacity, View, Image, ScrollView, TextInput } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import Header from '../../Header/Header';

function Devices({navigation}) {


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
                    <TextInput style={styles.inputText}/>
                </View>
            </View>
            <ScrollView style={styles.scrollContainer}>
                <Text style={styles.text}>
                Devices
                </Text>
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
    }
})