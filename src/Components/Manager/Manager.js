import React, {useState} from 'react';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import Header from '../Header/Header';

function Manager({navigation}) {


    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.backSearch}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
                    <AntDesign name="leftcircle" size={40} color='#80808070' />
                </TouchableOpacity>
            </View>
            <View style={styles.managerOptions}>
                <TouchableOpacity style={styles.button} >
                    <Text style={styles.text}>Produtos</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.text}>Lojas</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.text}>Dispositivos</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.text}>Usuários</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default Manager;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backSearch: {
        height: '10%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: '2%'
        // borderColor: '#000',
        // borderWidth: 5,
    },
    managerOptions: {
        flex: .8,
        justifyContent: 'center',
        alignItems: 'center',
        // borderColor: '#000',
        // borderWidth: 5,
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    button: {
        justifyContent: 'center',
        elevation: 4,
        height: '15%',
        width: '85%',
        paddingLeft: '9%',
        marginBottom: '5%',
        borderColor: '#C0C0C0'
    }
})