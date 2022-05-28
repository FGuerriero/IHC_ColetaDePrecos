import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { AntDesign } from '@expo/vector-icons';

export default function ScanBarCode(props) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === 'granted')
  },[])

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Código Escaneado! \nTipo: ${type} \nDado: ${data}`);
    props.handleBarCode(data)
    props.handleScannState(false)
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => props.handleScannState(false)}>
              <AntDesign name="leftcircle" size={50} color='#3cbfad' />
          </TouchableOpacity>
      </View>
      <View style={styles.barCodeContainer}>
        <BarCodeScanner 
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={styles.barCodeScanner}
        />
      </View>
      <View style={styles.btnScannContainer}>
        <TouchableOpacity 
          style={styles.btnScann}
          onPress={() => setScanned(false)} 
        ><Text style={styles.txtBtnScann}>Escanear Código</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30
  },
  barCodeScanner: {
    flex: 1
  },
  barCodeContainer:{
    flex: 1,
  },
  btnScannContainer: {
    flex: .2
  },
  btnScann: {
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#3cbfadc5',
    elevation: 5,
    width: 300,
    height: 50,
    borderWidth: .01,
    borderRadius: 40,
  },
  txtBtnScann: {
    justifyContent: 'center',
    fontSize: 18,
    color: 'white'
  },
  header: {
      flex: .15,
      justifyContent: 'flex-end',
      paddingLeft: 10
  },
  backButton: {
      alignSelf: 'flex-start'
  },
})