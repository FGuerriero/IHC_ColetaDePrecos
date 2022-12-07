import React, { createContext, useState, useEffect } from "react";
import {db,collection, getDocs,addDoc,doc,query,where,deleteDoc, auth} from "../config/firebase.js"; 
import { Alert } from 'react-native'
import NetInfo from '@react-native-community/netinfo';

export const AuthContext = createContext()

function AuthProvider ({children}){
    const [userAuth, setUserAuth] = useState({nome: ''})

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            console.log('Connection type', state.type);
            console.log('Is connected?', state.isConnected);
            //console.log("Status REDE: ", state)
        });

        if(Object.keys(auth).indexOf("currentUser") > -1){
            getDocs(collection(db, "Usuarios")).then((snapShot) => {
                let newUser = snapShot.docs.map((doc) => {
                    let docID = doc._document.key.path.segments.pop()
                    return {...doc.data(), id: docID, iscurrUsr: (doc.data().uid == auth.currentUser.uid)}
                })
    
                newUser = newUser.filter( curr => curr.iscurrUsr)
                setUserAuth(newUser[0])
            }).catch(err => {
                Alert.alert("Erro de Login: ", err.message)
            })
        }
    }, [])
    
    return(
        <AuthContext.Provider value={{ userAuth, setUserAuth}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;