import React, { useContext, useEffect } from 'react';
import { Text, StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import Header from '../Header/Header';

import {AuthContext} from '../../Context/context'
import {db,auth,collection, getDocs,addDoc,doc,query,where,deleteDoc} from "../../config/firebase.js";

function Home({ navigation }) {
    const { userAuth, setUserAuth } = useContext(AuthContext)

    useEffect(() => {
        getDocs(collection(db, "Usuarios")).then((snapShot) => {
            const newUser = snapShot.docs.filter((doc) => {
                return doc.data().uid == auth.currentUser.uid
            })
            //console.log("Resultado Login: ", newUser[0]._document.data)
            setUserAuth({
                nome: newUser[0]._document.data.value.mapValue.fields.nome.stringValue,
                email: newUser[0]._document.data.value.mapValue.fields.email.stringValue,
                tipo: newUser[0]._document.data.value.mapValue.fields.tipo.stringValue,
                uid: newUser[0]._document.data.value.mapValue.fields.uid.stringValue
            })
        })
        
        console.log("Current User: ", auth.currentUser.uid)
        return
    },[])
    
    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.body}>
                <Image 
                    source={require('../../../assets/LOGO_coletaPreços.png')}
                    resizeMode= 'contain'
                    style={{marginBottom: '20%'}}
                />
                <View style={styles.optionsHome}>
                    <TouchableOpacity style={styles.novaColeta} onPress={() => navigation.navigate('SendPic')}>
                        <Image 
                            source={require('../../../assets/novaColeta.png')}
                        />
                    </TouchableOpacity>
                    <View style={styles.minorButtons}>
                        <TouchableOpacity onPress={() => navigation.navigate('CheckList')}>
                            <Image 
                                source={require('../../../assets/checklist.png')}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Manager')}>
                            <Image 
                                source={require('../../../assets/gerenciador.png')}
                            />
                        </TouchableOpacity>
                        {/* <Image 
                            source={require('../../../assets/sincronização.png')}
                            style={{opacity: 0.5}}
                        />
                        <Image 
                            source={require('../../../assets/pesquisarProdutos.png')}
                            style={{opacity: 0.5}}
                        /> */}
                    </View>
                </View>
            </View>
        </View>
    );
}

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    logo: {
        flex: .4,
        backgroundColor: 'white',
        width: 150,
        marginLeft: 5
    },
    title: {
        flex: .4,
        alignSelf: 'center',
        marginTop: 10,
        fontWeight: 'bold',
        fontSize: 30,
        color: 'black'
    },
    body: {
        flex: .8,
        alignItems: 'center',
        paddingTop: '10%'
    },
    optionsHome: {
        flex: 1,
        alignItems: 'center',
        width: '100%',
    },
    novaColeta: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        elevation: 4,
        width: '80%',
        height: '30%',
        marginBottom: '2%'
    },
    minorButtons: {
        display: 'flex',
        flexDirection: 'row',
    },
    fakeBtns: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    textPicButton: {
        justifyContent: 'center',
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold'
    },
    conection: {
        alignSelf: 'flex-end',
        marginEnd: 30,
        backgroundColor: '#3cbfadc5',
        borderRadius: 40,
        padding: 5
    }
})