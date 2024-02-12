import React from 'react'
import {useState, useEffect, createContext} from "react";
import axios from "axios";

const AuthContext= createContext();
function AuthContextProvider(props) {
    const [loggedIn, setloggedIn] = useState(false);
    async function func(){
        const status = await axios.get(`${process.env.REACT_APP_API_URL}/auth/loggedIn`);
        setloggedIn(status.data);
    }
    useEffect(()=>{
        func();
    },[])
  return ( 
    <AuthContext.Provider value={{loggedIn, func}}>
    {props.children}
    </AuthContext.Provider>
  )
}
export default AuthContext;
export {AuthContextProvider};