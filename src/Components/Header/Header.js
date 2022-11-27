import { TabRouter } from '@react-navigation/native';
import React, { useEffect, useState, useContext } from 'react';
import { Text, StyleSheet, TouchableHighlight, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import { auth } from '../../config/firebase';

import {AuthContext} from '../../Context/context'

function Header() {
    const navigation = useNavigation()
    const { userAuth } = useContext(AuthContext)

    function deslogar() {
        auth.signOut();
        navigation.navigate('Login');
    }

    useEffect(() => {
    },[])

    return (
        <View style={styles.container}>
            <TouchableHighlight style={styles.profileImgContainer} onPress={() => console.log("Adicionar variável para controlar Perfil")}>
                <Image
                    source={require('../../../assets/profilePic.png')}
                    // resizeMode= 'contain'
                    style={styles.profileImg}
                />
            </TouchableHighlight>
            <View style={styles.headerText}>
                <TouchableOpacity>
                    <Text style={styles.text}>
                        {userAuth.nome}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deslogar()}>
                    <Text style={styles.text}>
                        Sair
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default Header;

const styles = StyleSheet.create({
    container: {
        // flex: 2,
        flexDirection: 'row',
        height: 90,
        // width: '100%',
        backgroundColor: '#000',
        marginTop: '6%',
        alignItems: 'center'
    },
    profileImgContainer: {
        marginLeft: '1%',
        height: 50,
        width: 50,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    profileImg: {
        height: '100%',
        width: '100%',
        borderRadius: 40,
        backgroundColor: '#fff'
    },
    text: {
        fontSize: 20,
        color: '#FFF',
        fontWeight: 'bold',
        marginLeft: '1%'
    },
    headerText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // borderColor: '#f57',
        // borderWidth: 3,
        width: '80%',
        marginLeft: '2%'
    }
})