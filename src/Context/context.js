import React, { createContext, useState, useEffect } from "react";
import {db,collection, getDocs,addDoc,doc,query,where,deleteDoc, auth} from "../config/firebase.js"; 
import { Alert } from 'react-native'

export const AuthContext = createContext()

function AuthProvider ({children}){
    const [userAuth, setUserAuth] = useState({nome: ''})

    // useEffect(() => {
    //     if(!!auth.currentUser){
    //         getDocs(collection(db, "Usuarios")).then((snapShot) => {
    //             //console.log("Snapshot: ", snapShot.docs)
    //             let newUser = snapShot.docs.map((doc) => {
    //                 let docID = doc._document.key.path.segments.pop()
    //                 console.log("Doc: ", doc.data().uid)
    //                 console.log("Auth: ", auth.currentUser.uid)
    //                 return {...doc.data(), id: docID, iscurrUsr: (doc.data().uid == auth.currentUser.uid)}
    //             })
    
    //             newUser = newUser.filter( curr => curr.iscurrUsr)
    //             console.log("TEEEEEE: ", newUser[0])
    //             setUserAuth(newUser[0])
    
    //             console.log("auth: ", userAuth)
    //             console.log("AAAAAAAAAAAAAAAA: Entrou Aqui")
    //         }).catch(err => {
    //             Alert.alert("Erro de Login: ", err.message)
    //         })
    //     }
    // }, [auth])
    
    return(
        <AuthContext.Provider value={{ userAuth, setUserAuth}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;