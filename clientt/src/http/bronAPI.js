import {$authHost} from "./index";
import Elem_Stat_Bron from "../store/Elem_Stat_Bron";

const EXB=new Elem_Stat_Bron(null)


export const createBron = async (bron) => {
    await $authHost.post('api/bron', bron).then((data)=>{
        const {status,statusText}=data
        EXB.setOBron(data)
        EXB.setmsg(statusText)
        EXB.setCode(status)
    }).catch((error) => {
        EXB.setOBron(error.response.data)
        EXB.setmsg(error.response.data.message)
        EXB.setCode(error.response.status)
    }).finally(()=> { return EXB;})
    return EXB}


export const BronLimit = async (seanIdSeans) => {
    await $authHost.get('api/bron/limit', {params: {seanIdSeans}}).then((data)=>{
        const {status,statusText}=data
        EXB.setLimit(data?.data?.limitbron)
        EXB.setmsg(statusText)
        EXB.setCode(status)
    }).catch((error) => {
        EXB.setLimit(error.response.data)
        EXB.setmsg(error.response.data.message)
        EXB.setCode(error.response.status)
    }).finally(()=> { return EXB;})
    return EXB}

export const fetchBron = async (id=null,mybron=false,page, limit,searchtext,date=null) => {
    await $authHost.get('api/bron/brons', {params: {id,mybron,page, limit,searchtext,date}}).then((data)=>{
        const {status,statusText}=data
        //console.log(data?.data)
        EXB.setBron(data?.data)
        EXB.setmsg(statusText)
        EXB.setCode(status)
    }).catch((error) => {
        EXB.setBron(error.response.data)
        EXB.setCode(error.response.status)
        EXB.setmsg(error.response.data.message)
    })

    return EXB
}

export const updateBron = async (id,metod,kode) => {
    await $authHost.put('api/bron/' + id,{metod,kode}).then((data)=>{
        const {status,statusText}=data

        EXB.setCode(status)
        EXB.setmsg(statusText)
    }).catch((error) => {
        console.log(error.response)
        EXB.setCode(error.response.status)
        EXB.setmsg(error.response.data.message)
    })
    return EXB
}

export const buyBron = async (id,date) => {
    await $authHost.put('api/bron/buy/' + id,date).then((data)=>{
        const {status,statusText}=data
        EXB.setCode(status)
        EXB.setmsg(statusText)
    }).catch((error) => {
        EXB.setCode(error.response.status)
        EXB.setmsg(error.response.data.message)
    })
    return EXB
}