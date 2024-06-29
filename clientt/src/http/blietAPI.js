import {$authHost,$host} from "./index";
import Elem_Stat_Bilet from "../store/Elem_Stat_Bilet";

const EXB=new Elem_Stat_Bilet(null)

export const createBilet = async (bilet) => {
    await $authHost.post('api/bilet', bilet).then((data)=>{
        const {status,statusText}=data
        EXB.setOBilet(data)
        EXB.setmsg(statusText)
        EXB.setCode(status)
    }).catch((error) => {
        EXB.setOBilet(error.response.data)
        EXB.setmsg(error.response.data.message)
        EXB.setCode(error.response.status)
    }).finally(()=> { return EXB;})
    return EXB}



export const SeansMesta = async (seanIdSeans) => {
    await $host.get('api/bilet/seansmesta', {'params': {seanIdSeans:seanIdSeans}}).then((data)=>{
        const {status,statusText}=data
        EXB.setMesta(data?.data?.mesta)
        EXB.setmsg(statusText)
        EXB.setCode(status)
    }).catch((error) => {
        EXB.setMesta(error.response.data)
        EXB.setmsg(error.response.data.message)
        EXB.setCode(error.response.status)
    }).finally(()=> { return EXB;})
    return EXB}


export const MySeansMesta = async (seanIdSeans) => {
    await $authHost.get('api/bilet/mymesta', {'params': {seanIdSeans:seanIdSeans}}).then((data)=>{
        const {status,statusText}=data
        EXB.setmestabron(data?.data?.mestabron)
        EXB.setmestabuy(data?.data?.mestabuy)
        EXB.setmsg(statusText)
        EXB.setCode(status)
    }).catch((error) => {
        EXB.setmestabron(error.response.data)
        EXB.setmestabuy(error.response.data)
        EXB.setmsg(error.response.data.message)
        EXB.setCode(error.response.status)
    }).finally(()=> { return EXB;})
    return EXB}


export const fetchBilet = async (mybilet=false,page, limit,searchtext,date=null) => {
    await $authHost.get('api/bilet/bilets', {params: {mybilet,page, limit,searchtext,date}}).then((data)=>{
        const {status,statusText}=data
            //console.log(data?.data)
        EXB.setBilet(data?.data)
        EXB.setmsg(statusText)
        EXB.setCode(status)
    }).catch((error) => {
        EXB.setBilet(error.response.data)
        EXB.setCode(error.response.status)
        EXB.setmsg(error.response.data.message)
    })

    return EXB
}