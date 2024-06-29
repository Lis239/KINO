import {$authHost,$host} from "./index";
import jwt_decode from "jwt-decode";
import Elem_Stat from "../store/Elem_Stat";
const EX=new Elem_Stat({},null,"")

export const registration = async (login,pass,lname,fname,mname,email) => {
    await $host.post('api/user/registration', {login,pass,lname,fname,mname,email}).then((data)=>{
        const {status,statusText}=data
        const {token}=data.data
        localStorage.setItem('token', token)
        EX.setUser(jwt_decode(token))
        EX.setmsg(statusText)
        EX.setCode(status)
    }).catch((error) => {
        EX.setUser(error.response.data)
        EX.setmsg(error.response.data.message)
        EX.setCode(error.response.status)
    })
    return EX
}
export const logIn = async (login, pass) => {
    await $host.post('api/user/login', {login, pass}).then((data)=>{
        const {status,statusText}=data
        const {token}=data.data
        localStorage.setItem('token', token)
        EX.setUser(jwt_decode(token))
        EX.setmsg(statusText)
        EX.setCode(status)
    }).catch((error) => {
        EX.setUser(null)
        EX.setmsg(error.response.data.message)
        EX.setCode(error.response.status)

    })

    return EX
}
export const check = async () => {
    await $authHost.get('api/user/auth' ).then((data)=>{
        const {status,statusText}=data
        const {token}=data.data
        localStorage.setItem('token', token)
        EX.setUser(jwt_decode(token))
        EX.setCode(status)
        EX.setmsg(statusText)
    }).catch((error) => {

        EX.setCode(error.response.status)
        EX.setmsg(error.response.message)
    })

    return EX
}
export const SUser = async (id,user) =>{
    await $authHost.put('api/user/SUser/'+id ,user).then((data)=>{
        const {status,statusText}=data
        EX.setUser(data?.data?.user)
        EX.setCode(status)
        EX.setmsg(statusText)
    }).catch((error) => {
        EX.setCode(error?.response?.data?.status)
        EX.setmsg(error?.response?.data?.message)
    })

    return EX
}
export const fetchOneUs = async (id) => {
    await $authHost.get('api/user/auth/' + id).then((data)=>{
        const {status,statusText}=data
        EX.setUser(data?.data?.user)
        EX.setCode(status)
        EX.setmsg(statusText)
    }).catch((error) => {
        EX.setCode(error?.response?.data?.status)
        EX.setmsg(error?.response?.data?.message)
    })

    return EX
}