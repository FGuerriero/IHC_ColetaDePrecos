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
                    <Text style={styles.title}>COLETOR DE PREÇOS</Text>
                </View>

                <View style={styles.loginForm}>
                    <Text style={styles.label}> Login: </Text>
                    <TextInput
                        style={styles.input}
                        placeholder={'User'}
                        onChangeText={inputLogin => setLogin(inputLogin)}
                    />
                    <Text style={styles.label}> Password: </Text>
                    <TextInput
                        style={styles.input}
                        placeholder={'*********'}
                        onChangeText={inputPass => setPassword(inputPass)}
                        secureTextEntry={true}
                    />
                </View>
                
                <View style={styles.formButtons}>
                    <TouchableOpacity style={styles.btnLogin} color='#3cbfad' onPress={ () => {
                        setLoading(true)
                        setTimeout( () => {
                            props.handleLogin(true)
                        },3500)
                    }}>
                        <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'white' }}>Login</Text>
                    </TouchableOpacity>
                <ActivityIndicator animating={loading} size="large" color="#3cbfad"/>
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
    title: {
        flex: .3,
        marginTop: 10,
        fontWeight: 'bold',
        fontSize: 30,
        color: '#3cbfad',
        textAlign: 'center',
        // borderColor: '#000',
        // borderWidth: 5
    },
    loginForm: {
        flex: .35,
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 10
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
        width: 300,
        height: 35,
        textAlign: 'center',
        alignSelf: 'center',
        marginTop: 5
    },
    formButtons: {
        flex: .3,
        margin: 20,
        alignItems: 'center',
    },
    btnLogin: {
        backgroundColor: '#3cbfad',
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        width: 300,
        height:45,
        elevation: 5
    }
})