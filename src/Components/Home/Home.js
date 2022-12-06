import React, { useContext, useEffect } from 'react';
import { Text, StyleSheet, TouchableOpacity, View, Image, Alert } from 'react-native';
import Header from '../Header/Header';

import {AuthContext} from '../../Context/context'
import {db,auth,collection, getDocs,addDoc,doc,query,where,deleteDoc} from "../../config/firebase.js";

function Home({ navigation }) {
    const { userAuth, setUserAuth } = useContext(AuthContext)
    
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
                        {
                            ((typeof userAuth === 'object' && (Object.keys(userAuth).indexOf('tipo') > -1)) ? userAuth.tipo : "Coletor" ) == "Coletor" ?
                                undefined
                            :
                                <TouchableOpacity onPress={() => navigation.navigate('Manager')}>
                                    <Image 
                                        source={require('../../../assets/gerenciador.png')}
                                    />
                                </TouchableOpacity>
                        }
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
        width: '80%',
        // borderColor: '#000',
        // borderWidth: 2
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