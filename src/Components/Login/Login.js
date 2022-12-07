import React, { useEffect, useState, useContext } from 'react';
import { Text, StyleSheet, TouchableOpacity, Alert, 
    View, ScrollView, ActivityIndicator, Image, TextInput
 } from 'react-native';
 import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
 import {db,collection, getDocs,addDoc,doc,query,where,deleteDoc, auth} from "../../config/firebase.js";
 import { logar } from '../../servicos/requisicoesFirebase';

import { Alerta } from '../Alerta';
import {AuthContext} from '../../Context/context'

function Login({ navigation }) {
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const [statusError, setStatusError] = useState('');
    const [mensagemError, setMensagemError] = useState('');

    const { userAuth, setUserAuth } = useContext(AuthContext)

    useEffect(() => {
        if(Object.keys(userAuth).indexOf('nome') > -1 && userAuth.nome != ''){
            navigation.push('Home')
        }
        // let authFlag = true
        // if( !auth && authFlag ){
        //     authFlag = false
        //     updateAuth()
        // }
        //console.log("Auth: ", auth.currentUser)
    },[userAuth])

    async function updateAuth() {
        getDocs(collection(db, "Usuarios")).then((snapShot) => {
            //console.log("Snapshot: ", snapShot.docs)
            let newUser = snapShot.docs.map((doc) => {
                let docID = doc._document.key.path.segments.pop()
                // console.log("Doc: ", doc.data().uid)
                // console.log("Auth: ", auth.currentUser.uid)
                return {...doc.data(), id: docID, iscurrUsr: (doc.data().uid == auth.currentUser.uid)}
            })

            newUser = newUser.filter( curr => curr.iscurrUsr)
            //console.log("TEEEEEE: ", newUser[0])
            setUserAuth(newUser[0])

            //console.log("auth: ", userAuth)
            //console.log("AAAAAAAAAAAAAAAA: Entrou Aqui")
            setLogin('')
            setPassword('')
            setLoading(false)
        }).catch(err => {
            Alert.alert("Erro de Login: ", err.message)
        })
    }

    async function realizarLogin() {
        console.log(login);
        console.log(password);
        if (login == '') {
            setMensagemError('O login é obrigatório!');
            setStatusError('firebase');
        } else if (password == '') {
            setMensagemError('A senha é obrigatória!');
            setStatusError('firebase');
        } else {
            setLoading(true)
            const resultado = await logar(login, password);
            
            if (resultado == 'erro') {
                setStatusError('firebase')
                setMensagemError('Login ou senha não conferem')
                setLoading(false)
            }
            else {
                await updateAuth()
            }
        }
    }
    return (
        <KeyboardAwareScrollView style={styles.container}>
                <View style={styles.header}>
                    <Image
                        source={require('../../../assets/LOGO_coletaPreços.png')}
                        resizeMode='contain'
                    />
                </View>
                <View style={styles.loginForm}>
                    <TextInput
                        style={styles.input}
                        placeholder={'insira seu e-mail'}
                        onChangeText={inputLogin => setLogin(inputLogin)}
                        value={login}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder={'insira sua senha'}
                        onChangeText={inputPass => setPassword(inputPass)}
                        secureTextEntry={true}
                        value={password}
                    />
                </View>
                <View style={styles.formButtons}>
                    <TouchableOpacity style={styles.btnLogin} onPress={() => {
                        realizarLogin()
                    }}>
                        <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'white' }}>LOGIN</Text>
                    </TouchableOpacity>
                    <Text
                        style={{ fontSize: 15, marginBottom: '16%' }}
                        onPress={() => navigation.push('ForgotPass')}
                    >
                        Esqueci minha Senha
                    </Text>
                    <TouchableOpacity style={styles.btnNovaConta} color='#3cbfad' onPress={() => navigation.push('NewAccount')}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>NOVA CONTA</Text>
                    </TouchableOpacity>
                    <ActivityIndicator animating={loading} size="large" color="#A60A0A"/>
                </View>
                <Alerta
                    mensagem={mensagemError}
                    error={statusError == 'firebase'}
                    setError={setStatusError}
                />
        </KeyboardAwareScrollView>
    );
}

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: '50%'
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
    loginForm: {
        flex: .2,
        justifyContent: 'center',
        marginTop: '20%',
        marginBottom: '1%',
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
        height: '30%',
        textAlign: 'center',
        alignSelf: 'center',
        marginBottom: '7%',
        borderRadius: 10
    },
    formButtons: {
        flex: .3,
        margin: 20,
        alignItems: 'center',
    },
    btnLogin: {
        backgroundColor: '#A60A0A',
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        width: '70%',
        height: '22%',
        elevation: 5
    },
    btnNovaConta: {
        backgroundColor: '#F2BB13',
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        width: '50%',
        height: '20%',
        elevation: 5
    },
})