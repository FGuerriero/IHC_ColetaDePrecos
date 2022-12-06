import React, { useState, useContext } from 'react';
import { Text, StyleSheet, TouchableOpacity, Alert, View, ScrollView, ActivityIndicator, Image, TextInput } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {db,collection, getDocs,addDoc,doc,query,where,deleteDoc} from "../../config/firebase.js";

import { Alerta } from '../Alerta';
import { cadastrar } from '../../servicos/requisicoesFirebase';
import {AuthContext} from '../../Context/context'

function NewAccount({ navigation }) {
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const [passConfirm, setPassConfirm] = useState('')
    const [loading, setLoading] = useState(false)
    const [statusError, setStatusError] = useState('');
    const [mensagemError, setMensagemError] = useState('');
    const { userAuth, setUserAuth } = useContext(AuthContext)

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
            setLoading(true)

            await getDocs(collection(db, "Usuarios")).then( async (snapShot) => {
                const newUser = snapShot.docs.filter((doc) => {
                    return doc.data().email == email
                })
                if(newUser[0]){
                    Alert.alert("Já existe uma conta cadastrada com este email!")
                    setLoading(false)
                }else{
                    const resultado = await cadastrar(email, pass);
                    console.log("Nome: ", nome)
                    console.log("Email: ", email)
                    setStatusError('firebase');
                    if (resultado.user) {
                        console.log("Cadastro realizado com sucesso!")
                        Alert.alert("Cadastro realizado com sucesso!")
                        const newUser = await addDoc(collection(db, "Usuarios"), {
                            nome: nome,
                            email: email,
                            tipo: 'Coletor',
                            uid: resultado.user.uid
                        });
                        setUserAuth({
                            nome: nome,
                            email: email,
                            tipo: 'Coletor',
                            uid: resultado.user.uid
                        })
                        setMensagemError('Usuário criado com sucesso!');
                        setEmail('');
                        setPass('');
                        setPassConfirm('');
                        setLoading(false)
                    }
                    else {
                        setMensagemError(resultado);
                        setLoading(false)
                    }
                }
            })
        }
    }

    return (
        <KeyboardAwareScrollView style={styles.scrollContainer}>
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
                <ActivityIndicator animating={loading} size="large" color="#A60A0A"/>
                {/* <Alerta
                    mensagem={mensagemError}
                    error={statusError == 'firebase'}
                    setError={setStatusError}
                /> */}
            </View>
        </KeyboardAwareScrollView>
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