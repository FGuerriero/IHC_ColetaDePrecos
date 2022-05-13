import { StyleSheet, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import Login from './src/Components/Login/Login';
import Home from './src/Components/Home/Home';

export default function App() {
  const [loginValidation, setLoginValidation] = useState(false)

  return (
    <SafeAreaView style={styles.container}>
      {
        loginValidation ? <Home /> : <Login handleLogin={setLoginValidation}/>
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})