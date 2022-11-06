import { StyleSheet, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackView } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import Login from './src/Components/Login/Login';
import Home from './src/Components/Home/Home';
import SendPic from './src/Components/ProductPriceCollection/SendPic';
import CheckList from './src/Components/CheckList/CheckList';
import Manager from './src/Components/Manager/Manager';
import Header from './src/Components/Header/Header';
import Products from './src/Components/Manager/Manager Options/Products';

export default function App() {
  // const [loginValidation, setLoginValidation] = useState(false)
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer style={styles.container} initialRouteName="Login">
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login}/>
        <Stack.Screen name="Home" component={Home}/>
        <Stack.Screen name="SendPic" component={SendPic} />
        <Stack.Screen name="CheckList" component={CheckList} />
        <Stack.Screen name="Manager" component={Manager} />
          <Stack.Screen name="Products" component={Products} />
          {/* <Stack.Screen name="Stores" component={Manager} />
          <Stack.Screen name="Manager" component={Manager} />
          <Stack.Screen name="Manager" component={Manager} />
          <Stack.Screen name="Manager" component={Manager} /> */}
      </Stack.Navigator>
      {/* {
        loginValidation ? <Home /> : <Login handleLogin={setLoginValidation}/>
      } */}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})