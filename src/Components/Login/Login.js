import React, { useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, Alert, View, ActivityIndicator, Image, TextInput } from 'react-native';
import CreateAccount from './CreateAccount';


function Login(props) {
    const [login, setLogin] = useState(null)
    const [password, setPassword] = useState(null)
    const [createAccount, setCreateAccount] = useState(false)
    const [loading, setLoading] = useState(false)

    function handleLogin() {
        console.log("Loggin in...")
        setLoading(true)

        if(login === null || password === null){
            Alert.alert("Login and Password must be filled.")
            setLoading(false)
            return
        }
        return fetch('https://vital-skin-api.hasura.app/v1/graphql',{
            method: 'POST',
            headers: {
                //Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-hasura-admin-secret': '8hpDTHHrjR9rFvkVuJei3AgG52UFZ069udaENYKNeB36p6V3K1I6VzXWaEK5RmVv'
            },
            body: JSON.stringify({
                query: `{
                    users(where: {login: {_eq: ${login}}}) {
                        password
                        description
                    }
                }`
            })
        }).then(response => {
            if (response.status >= 400) {
                throw new Error("Error fetching data");
                setLoading(false)
            } else {
                return response.json();
            }
        }).then( (data) => {
            console.log('response now: ', data.data) 
            if(data.data.users.length === 0){
                Alert.alert("User does not exist!")
                setLoading(false)
            }else{
                if(data.data.users[0].password === password){
                    props.handleLogin(true)
                }else {
                    Alert.alert("Wrong password. \nTry Again!")
                    setLoading(false)
                }
            }
        }).catch( (error) => {
            console.log(error)
            setLoading(false)
        })
    }

    return (
        <View style={styles.container}>
            {
                createAccount ?
                <CreateAccount /> :
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Image 
                            style={styles.logo} 
                            source={require('../../../assets/logo.png')} 
                            resizeMode= 'contain'
                        />
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
                        <TouchableOpacity style={styles.btnLogin} color='#3cbfad' onPress={ () => handleLogin() }>
                            <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'white' }}>Login</Text>
                        </TouchableOpacity>
                        {/* <TouchableOpacity style={styles.btnCreateAcc} onPress={ () =>  setCreateAccount(true)}>
                            <Text style={{ fontSize: 15 }}>Create Accout</Text>
                        </TouchableOpacity> */}
                    <ActivityIndicator animating={loading} size="large" color="#3cbfad"/>
                    </View>
                    
                </View>
            }
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
        flex: .35,
        alignItems: 'center',
        justifyContent: 'center',
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
        alignSelf: 'center'
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
    },
    btnCreateAcc: {
        flex: .2,
        backgroundColor: 'white',
        borderRadius: 40,
        borderColor: '#d3d3d3',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: 300,
        elevation: 5
    }
})