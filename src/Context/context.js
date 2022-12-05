import React, { createContext, useState } from "react";

export const AuthContext = createContext()

function AuthProvider ({children}){
    const [userAuth, setUserAuth] = useState({nome: ''})
    
    return(
        <AuthContext.Provider value={{ userAuth, setUserAuth}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;