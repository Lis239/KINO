import {$authHost} from "./index";
import Elem_Stat_Smens from "../store/Elem_Stat_Smens";

const EX=new Elem_Stat_Smens(null)

export const createSmens = async (smens) => {
    await $authHost.post('api/smena', smens).then((data)=>{
        const {status,statusText}=data
        EX.setSmens(data)
        EX.setmsg(statusText)
        EX.setCode(status)
    }).catch((error) => {
        EX.setSmens(error?.response?.data)
        EX.setmsg(error?.response?.data?.message)
        EX.setCode(error?.response?.status)
    }).finally(()=>
        { return EX;}
    )
    return EX;
}

export const fetchSmens= async (searchtext= null) => {
    await $authHost.get('api/smena', {params: {searchtext}}).then((data)=>{
        const {status,statusText}=data
        EX.setSmens(data?.data?.smena)
        EX.setmsg(statusText)
        EX.setCode(status)
    }).catch((error) => {
        EX.setSmens(error?.response?.data)
        EX.setmsg(error?.response?.data?.message)
        EX.setCode(error?.response?.status)
    }).finally(()=>
        { return EX;}
    )
    return EX;
}

export const fetchOneSmena = async (id) => {
    await $authHost.get('api/smena/' + id).then((data)=>{
        const {status,statusText}=data
        EX.setOSmena(data?.data?.smena)
        EX.setCode(status)
        EX.setmsg(statusText)
    }).catch((error) => {
        EX.setOSmena(error?.response?.data)
        EX.setmsg(error?.response?.data?.message)
        EX.setCode(error?.response?.status)
    }).finally(()=>
        { return EX;}
    )
    return EX;
}


export const updateOneSmena = async (id,smena) => {
    await $authHost.put('api/smena/' + id,smena).then((data)=>{
        const {status,statusText}=data
        EX.setOSmena(data?.data?.smena)
        EX.setCode(status)
        EX.setmsg(statusText)
    }).catch((error) => {
        EX.setOSmena(error?.response?.data)
        EX.setmsg(error?.response?.data?.message)
        EX.setCode(error?.response?.status)
    }).finally(()=>
        { return EX;}
    )
    return EX;
}

export const delOneSmena = async (id) => {
    await $authHost.delete('api/smena/' + id).then((data)=>{
        const {status,statusText}=data

        EX.setCode(status)
        EX.setmsg(statusText)
    }).catch((error) => {
        EX.setCode(error.response.data.status)
        EX.setmsg(error.response.data.message)
    })

    return EX
}