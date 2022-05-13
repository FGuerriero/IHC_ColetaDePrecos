import React from 'react';
import { Text, StyleSheet, TouchableOpacity, Alert, View, ImageBackground, Image, TextInput, Button } from 'react-native';

function CreateAccount(props) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.logoCotainer} >
                    <Image
                        source={require('../../../assets/logo.png')} 
                        style={styles.logo}
                        resizeMode= 'contain'
                    />
                </View>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Create Account</Text>
                </View>
            </View>

            <View style={styles.createAccForm}>
                <TextInput
                    style={styles.input}
                    placeholder={'Name'}
                    //onChangeText={inputLogin => setLogin(inputLogin)}
                />
                <TextInput
                    style={styles.input}
                    placeholder={'E-mail'}
                    //onChangeText={inputLogin => setLogin(inputLogin)}
                />
                <TextInput
                    style={styles.input}
                    placeholder={'*********'}
                    //onChangeText={inputPass => setPassword(inputPass)}
                />
            </View>
            <View style={styles.formButtons}>
                <TouchableOpacity style={styles.btnCreateAcc} color='#3cbfad' onPress={ () => console.log("Logging in 2...") }>
                    <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'white' }}>Create Accout</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnCancel} onPress={ () => setCreateAccount(true) }>
                    <Text style={{ fontSize: 15 }}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default CreateAccount;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 25,
        // borderColor: '#000',
        // borderWidth: 5
    },
    header: {
        flex: .2,
        marginTop: 10
    },
    logoCotainer: {
        flex: .4,
        alignItems: 'flex-start'
    },
    logo: {
        flex: 1,
        backgroundColor: 'white',
        width: 150,
        marginLeft: 10
    },
    headerTitleContainer: {
        flex: .5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: 20
    },
    createAccForm: {
        flex: .35,
        justifyContent: 'center',
        // borderColor: '#000',
        // borderWidth: 5
    },
    // label: {
    //     fontSize: 20,
    //     marginTop: 10,
    //     fontWeight: 'bold',
    //     marginBottom: 10,
    //     alignSelf: 'center'
    // },
    input: {
        flex: .18,
        fontSize: 15,
        borderBottomColor: '#d3d3d3',
        borderBottomWidth: 1,
        width: 300,
        alignSelf: 'center',
        marginBottom: 10
    },
    formButtons: {
        flex: .3,
        margin: 20,
        alignItems: 'center',
        justifyContent: 'center',
        // borderColor: '#000',
        // borderWidth: 5
    },
    btnCreateAcc: {
        height: 50,
        backgroundColor: '#3cbfad',
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        width: 300,
        elevation: 5
    },
    btnCancel: {
        height: 50,
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