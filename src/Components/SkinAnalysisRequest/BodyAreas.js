import React, {useState} from 'react';
import {View, StyleSheet, Image, Text, TouchableOpacity} from 'react-native';
import ImageMapper from './ImageMapper/ImageMapper.js';
import RECTANGLE_MAP from './ImageMapper/configMap.ts';
import {human} from './ImageMapper/human.ts';

export default function BodyAreas(props) {
    
  const [areaLesion, setAreaLesion] = useState(0);
    
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image 
                    style={styles.logo} 
                    source={require('../../../assets/logo.png')} 
                    resizeMode= 'contain'
                />
                <Text style={styles.title}>Select Body Area</Text>
            </View>
            <ImageMapper
                imgHeight={364}
                imgWidth={300}
                imgSource={human[areaLesion].avatar}
                imgMap={RECTANGLE_MAP}
                onPress={(item) => setAreaLesion(item?.id)}
                containerStyle={styles.imgMapper}
            />
            <TouchableOpacity style={styles.btnConfirm} onPress={() => {
                props.handleSelection(areaLesion)
                props.handleBodyArea(false)
            }}>
                <Text style={styles.txtConfirm}>OK</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    imgMapper: {
        flex: .7,
        justifyContent: 'center',
        alignSelf: 'center'
    },
    header: {
        flex: .3,
        marginTop: 10
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
        marginTop: 30,
        fontWeight: 'bold',
        fontSize: 30,
        color: 'black'
    },
    btnConfirm: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: '#3cbfadc5',
        width: 220,
        height: 50,
        borderWidth: .01,
        borderRadius: 40,
        marginBottom: 30
    },
    txtConfirm: {
        justifyContent: 'center',
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold'
    }
})