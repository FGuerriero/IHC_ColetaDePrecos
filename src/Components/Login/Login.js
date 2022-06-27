import React, { useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, Alert, View, ActivityIndicator, Image, TextInput } from 'react-native';

function Login(props) {
    const [login, setLogin] = useState(null)
    const [password, setPassword] = useState(null)
    const [createAccount, setCreateAccount] = useState(false)
    const [loading, setLoading] = useState(false)

    return (
        <View style={styles.container}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Image 
                        source={require('../../../assets/LOGO_coletaPreços.png')}
                        resizeMode= 'contain'
                    />
                </View>

                <View style={styles.loginForm}>
                    <TextInput
                        style={styles.input}
                        placeholder={'insira seu e-mail'}
                        onChangeText={inputLogin => setLogin(inputLogin)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder={'insira sua senha'}
                        onChangeText={inputPass => setPassword(inputPass)}
                        secureTextEntry={true}
                    />
                </View>
                
                <View style={styles.formButtons}>
                    <TouchableOpacity style={styles.btnLogin} onPress={ () => {
                        setLoading(true)
                        setTimeout( () => {
                            props.handleLogin(true)
                        },3500)
                    }}>
                        <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'white' }}>LOGIN</Text>
                    </TouchableOpacity>
                    <Text style={{fontSize: 15, marginBottom: '16%'}}>Esqueci minha Senha</Text>
                    <TouchableOpacity style={styles.btnNovaConta} color='#3cbfad' >
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>NOVA CONTA</Text>
                    </TouchableOpacity>
                    <ActivityIndicator animating={loading} size="large" color="#A60A0A"/>
                </View>
                
            </View>
        </View>
    );
}

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 25
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
        marginTop: '2%',
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
        height: '28%',
        textAlign: 'center',
        alignSelf: 'center',
        marginBottom: '7%'
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