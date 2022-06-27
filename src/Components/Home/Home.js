import React, {useState} from 'react';
import { Text, StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import SendPic from '../ProductiPriceCollection/SendPic';

function Home() {
    const [newPic, setNewPic] = useState(false)
    
    return (
        <View style={styles.container}>
            {
                newPic?
                <SendPic handleNewPic={setNewPic}/>:
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Image
                            source={require('../../../assets/header.png')} 
                            resizeMode= 'stretch'
                            style={{height: '45%', width: '100%'}}
                        />
                    </View>
                    <View style={styles.body}>
                        <Image 
                            source={require('../../../assets/LOGO_coletaPreços.png')}
                            resizeMode= 'contain'
                            style={{marginBottom: '20%'}}
                        />
                        <View style={styles.optionsHome}>
                            <TouchableOpacity style={styles.novaColeta} onPress={() => setNewPic(true)}>
                                <Image 
                                    source={require('../../../assets/novaColeta.png')}
                                />
                            </TouchableOpacity>
                            <View style={styles.fakeBtns}>
                                <Image 
                                    source={require('../../../assets/checklist.png')}
                                    style={{opacity: 0.5}}
                                />
                                <Image 
                                    source={require('../../../assets/gerenciador.png')}
                                    style={{opacity: 0.5}}
                                />
                                <Image 
                                    source={require('../../../assets/sincronização.png')}
                                    style={{opacity: 0.5}}
                                />
                                <Image 
                                    source={require('../../../assets/pesquisarProdutos.png')}
                                    style={{opacity: 0.5}}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            }
        </View>
    );
}

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        flex: .2,
        marginTop: 25,
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