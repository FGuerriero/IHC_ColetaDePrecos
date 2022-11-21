import React, { useState } from 'react';
import { Text, StyleSheet, View, ScrollView, Image } from 'react-native';

function ForgotPass({ navigation }) {
    const [login, setLogin] = useState(null)
    const [password, setPassword] = useState(null)
    const [createAccount, setCreateAccount] = useState(false)
    const [loading, setLoading] = useState(false)

    return (
        <ScrollView style={styles.container}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Image 
                        source={require('../../../assets/LOGO_coletaPreços.png')}
                        resizeMode= 'contain'
                    />
                </View>
                
                <View style={styles.msgContainer}>
                    <Text  style={styles.msgText}>Entre em contato com o administrador pelo email abaixo: </Text>
                    <Text style={[styles.msgText,{fontWeight: 'bold'}]}>fernandoguerrierocs@gmail.com</Text>
                </View>
                
            </View>
        </ScrollView>
    );
}

export default ForgotPass;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: '25%'
    },
    header: {
        flex: .30,
        alignItems: 'center',
        justifyContent: 'center',
        // borderColor: '#000',
        // borderWidth: 5
    },
    msgContainer: {
        marginTop: '10%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    msgText: {
        fontSize: 20,
        marginBottom: '5%',
        alignSelf: 'center',
        justifyContent: 'center'
    }
})