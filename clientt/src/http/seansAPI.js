import {$authHost,$host} from "./index";
import Elem_Stat_Seans from "../store/Elem_Stat_Seans";

const EX=new Elem_Stat_Seans(null)

export const createSeans = async (seans) => {
    await $authHost.post('api/seans', seans).then((data)=>{
        const {status,statusText}=data
        EX.setSeans(data)
        EX.setmsg(statusText)
        EX.setCode(status)
    }).catch((error) => {
        EX.setSeans(error?.response?.data)
        EX.setmsg(error?.response?.data?.message)
        EX.setCode(error?.response?.status)
    }).finally(()=>
        { return EX;}
    )
    return EX;
}


export const fetchSeans = async (date=null,page, limit= 3,searchtext= null) => {
    await $host.get('api/seans', {params: {date,page, limit,searchtext}}).then((data)=>{
        const {status,statusText}=data
        EX.setSeans(data?.data?.seans)
        EX.setmsg(statusText)
        EX.setCode(status)
    }).catch((error) => {
        EX.setSeans(error?.response?.data)
        EX.setmsg(error?.response?.data?.message)
        EX.setCode(error?.response?.status)
    })
    return EX
}


export const fetchOneSeans = async (id) => {
    await $host.get('api/seans/' + id).then((data)=>{
        const {status,statusText}=data
        EX.setOSeans(data?.data?.seans)
        EX.setCode(status)
        EX.setmsg(statusText)

    }).catch((error) => {
        EX.setOSeans(error?.response?.data)
        EX.setCode(error?.response?.data?.status)
        EX.setmsg(error?.response?.data?.message)
    })

    return EX
}

export const updateOneSeans = async (id,seans) => {
    await $authHost.put('api/seans/' + id,seans).then((data)=>{
        const {status,statusText}=data
        EX.setOSeans(data?.data?.seans)
        EX.setCode(status)
        EX.setmsg(statusText)
    }).catch((error) => {
        EX.setOSeans(error?.response?.data)
        EX.setCode(error?.response?.data?.status)
        EX.setmsg(error?.response?.data?.message)
    })
    return EX
}

export const delOneSeans = async (id) => {
    await $authHost.delete('api/seans/' + id).then((data)=>{
        const {status,statusText}=data
        EX.setCode(status)
        EX.setmsg(statusText)
    }).catch((error) => {
        EX.setCode(error?.response?.data?.status)
        EX.setmsg(error?.response?.data?.message)
    })

    return EX
}