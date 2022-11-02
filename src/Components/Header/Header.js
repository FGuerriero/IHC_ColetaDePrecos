import React, {useState} from 'react';
import { Text, StyleSheet, TouchableHighlight, View, Image } from 'react-native';

function Header() {
    const [userName, setUserName] = useState('Visitante')
    const [conectionStatus, setConectionStatus] = useState('Online')

    return (
        <View style={styles.container}>
            <TouchableHighlight style={styles.profileImgContainer} onPress={() => console.log("Adicionar variável para controlar Perfil")}>
                <Image 
                    source={require('../../../assets/profilePic.png')} 
                    // resizeMode= 'contain'
                    style={styles.profileImg}
                />
            </TouchableHighlight>
            <View style={styles.headerText}>
                <Text style={styles.text}>
                    {userName}
                </Text>
                <Text style={styles.text}>
                    |
                </Text>
                <Text style={styles.text}>
                    {conectionStatus}
                </Text>
            </View>
        </View>
    );
}

export default Header;

const styles = StyleSheet.create({
    container: {
        // flex: 2,
        flexDirection: 'row',
        height: '10%',
        // width: '100%',
        backgroundColor: '#000',
        marginTop: '6%',
        alignItems: 'center'
    },
    profileImgContainer: {
        marginLeft: '1%',
        height: 50,
        width: 50,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    profileImg: {
        height: '100%',
        width: '100%',
        borderRadius: 40,
        backgroundColor: '#fff'
    },
    text: {
        fontSize: 20,
        color: '#FFF',
        fontWeight: 'bold',
        marginLeft: '1%'
    },
    headerText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderColor: '#f57',
        borderWidth: 3,
        width: '80%'
    }
})