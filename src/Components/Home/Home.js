import React, {useState} from 'react';
import { Text, StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import SendPic from '../SkinAnalysisRequest/SendPic';

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
                            style={styles.logo} 
                            source={require('../../../assets/logo.png')} 
                            resizeMode= 'contain'
                        />
                        <Text style={styles.title}>HOME</Text>
                    </View>
                    <View style={styles.body}>
                        <View style={styles.sendPic}>
                            <TouchableOpacity style={styles.takePicButton} onPress={() => setNewPic(true)}>
                                        <Text style={styles.textPicButton}>Colect new picture</Text>
                            </TouchableOpacity>
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
        flex: 1,
        marginTop: 10
    },
    header: {
        flex: .2,
        marginTop: 10,
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
        flex: .8
    },
    sendPic: {
        flex: .3
    },
    takePicButton: {
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: '#3cbfadc5',
        elevation: 5,
        width: 220,
        height: 50,
        borderWidth: .01,
        borderRadius: 40
    },
    textPicButton: {
        justifyContent: 'center',
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold'
    }
})