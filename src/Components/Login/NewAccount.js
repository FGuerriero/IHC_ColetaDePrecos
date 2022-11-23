import React, { useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, Alert, View, ScrollView, ActivityIndicator, Image, TextInput } from 'react-native';

import { Alerta } from '../Alerta';
import { cadastrar } from '../../servicos/requisicoesFirebase';

function NewAccount({ navigation }) {
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const [passConfirm, setPassConfirm] = useState('')
    const [loading, setLoading] = useState(false)
    const [statusError, setStatusError] = useState('');
    const [mensagemError, setMensagemError] = useState('');

    async function realizarCadastro() {
        if (nome == '') {
            setMensagemError('Preencha seu nome');
            setStatusError('firebase');        
        } else if (email == '') {
            setMensagemError('Preencha com seu email');
            setStatusError('firebase');
        } else if (pass == '') {
            setMensagemError('Digite sua senha');
            setStatusError('firebase');
        } else if (passConfirm == '') {
            setMensagemError('Confirme sua senha');
            setStatusError('firbase');
        } else if (passConfirm != pass) {
            setMensagemError('As senhas não conferem!');
            setStatusError('firebase');
        } else {
            const resultado = await cadastrar(email, pass);
            setStatusError('firebase');
            if (resultado == 'sucesso') {
                setMensagemError('Usuário criado com sucesso!');
                setEmail('');
                setPass('');
                setPassConfirm('');
            }
            else {
                setMensagemError(resultado);
            }
        }
    }

    return (
        <ScrollView style={styles.scrollContainer}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Image
                        source={require('../../../assets/LOGO_coletaPreços.png')}
                        resizeMode='contain'
                        style={{ marginBottom: '10%' }}
                    />
                </View>

                <View style={styles.userForm}>
                    <TextInput
                        style={styles.input}
                        placeholder={'Nome'}
                        onChangeText={inputLogin => setNome(inputLogin)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder={'E-mail'}
                        onChangeText={inputPass => setEmail(inputPass)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder={'senha'}
                        onChangeText={inputPass => setPass(inputPass)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder={'Confirmar Senha'}
                        onChangeText={inputPass => setPassConfirm(inputPass)}
                    />
                </View>
                <TouchableOpacity
                    style={styles.btnCadastrar}
                    onPress={() => realizarCadastro()}
                //color='#3cbfad' 
                >
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>CADASTRAR</Text>
                </TouchableOpacity>
                <Alerta
                    mensagem={mensagemError}
                    error={statusError == 'firebase'}
                    setError={setStatusError}
                />
            </View>
        </ScrollView>
    );
}

export default NewAccount;

const styles = StyleSheet.create({

    scrollContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
        height: '100%',
        paddingTop: '25%',
        paddingBottom: '25%'
        // borderColor: '#f00',
        // borderWidth: 10
    },
    header: {
        flex: .30,
        alignItems: 'center',
        justifyContent: 'center',
        // borderColor: '#000',
        // borderWidth: 5
    },
    logo: {
    },
    userForm: {
        flex: .2,
        justifyContent: 'center',
        marginTop: '20%',
        marginBottom: '20%',
    },
    label: {
        fontSize: 20,
        marginTop: 10,
        fontWeight: 'bold',
        marginBottom: 10,
        alignSelf: 'center'
    },
    input: {
        fontSize: 15,
        borderColor: '#d3d3d3',
        borderWidth: 1,
        width: '70%',
        height: '20%',
        textAlign: 'center',
        alignSelf: 'center',
        marginBottom: '7%',
        borderRadius: 10
    },
    btnCadastrar: {
        backgroundColor: '#F2BB13',
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '10%',
        width: '70%',
        height: '10%',
        elevation: 5,
        alignSelf: 'center'
    },
})