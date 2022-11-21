import React, { useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, Alert, View, ScrollView, ActivityIndicator, Image, TextInput } from 'react-native';

function NewAccount({ navigation }) {
    const [nome, setNome] = useState(null)
    const [email, setEmail] = useState(null)
    const [pass, setPass] = useState(null)
    const [passConfirm, setPassConfirm] = useState(null)
    const [loading, setLoading] = useState(false)

    const cadastrarUsuário = () => {
        if(nome === null){
            Alert.alert("Preencha Nome para prosseguir.")
        }else if(email === null || email.match(/@/g).length !== 1){
            Alert.alert("Preencha email válido para prosseguir.")
        }else if(pass === null){
            Alert.alert("Preencha senha para prosseguir.")
        }else if(passConfirm === null){
            Alert.alert("Confirme senha para prosseguir.")
        }else if(pass !== passConfirm){
            Alert.alert("Os campos de senha devem ser iguais!")
        }else{
            setLoading(true)
            setTimeout(() => {
                //Persistência de Usuário

                setLoading(false)
                navigation.goBack()
            },3000)
        }
    }

    return (
        <ScrollView style={styles.scrollContainer}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Image 
                        source={require('../../../assets/LOGO_coletaPreços.png')}
                        resizeMode= 'contain'
                        style={{marginBottom: '10%'}}
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
                    onPress={cadastrarUsuário}
                    //color='#3cbfad' 
                >
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>CADASTRAR</Text>
                </TouchableOpacity>
                <ActivityIndicator animating={loading} size="large" color="#A60A0A"/>
                
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