import { StyleSheet, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackView } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import Login from './src/Components/Login/Login';
import Home from './src/Components/Home/Home';
import SendPic from './src/Components/ProductPriceCollection/SendPic';
import TakePic from './src/Components/ProductPriceCollection/TakePic';
import CheckList from './src/Components/CheckList/CheckList';
import Manager from './src/Components/Manager/Manager';
import Products from './src/Components/Manager/Manager Options/Products';
import Stores from './src/Components/Manager/Manager Options/Stores';
import Devices from './src/Components/Manager/Manager Options/Devices'
import Users from './src/Components/Manager/Manager Options/Users';

export default function App() {
  // const [loginValidation, setLoginValidation] = useState(false)
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer style={styles.container} initialRouteName="Login">
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login}/>
        <Stack.Screen name="Home" component={Home}/>
        <Stack.Screen name="SendPic" component={SendPic} />
          <Stack.Screen name ="TakePic" component={TakePic} />
        <Stack.Screen name="CheckList" component={CheckList} />
        <Stack.Screen name="Manager" component={Manager} />
          <Stack.Screen name="Products" component={Products} />
          <Stack.Screen name="Stores" component={Stores} />
          <Stack.Screen name="Devices" component={Devices} />
          <Stack.Screen name="Users" component={Users} />
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