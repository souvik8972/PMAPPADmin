import { useContext } from "react"
import { checkTokenExpiration } from "../auth"
import { AuthContext } from "../../context/AuthContext"
import { router } from "expo-router"



export const exp=((time)=>{

    let a=1
    const {logout}=useContext(AuthContext)
    if(! checkTokenExpiration(time)){
        logout();
        router.replace('/login')

    }else{
        console.log("not expire")
    }

    
})