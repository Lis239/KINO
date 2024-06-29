import {$authHost} from "./index";
import Elem_Stat_Zal from "../store/Elem_Stat_Zal";

const EX=new Elem_Stat_Zal(null)

export const createZall = async (zal) => {
    await $authHost.post('api/zal', zal).then((data)=>{
        const {status,statusText}=data
        EX.setZal(data)
        EX.setmsg(statusText)
        EX.setCode(status)
    }).catch((error) => {
        EX.setZal(error?.response?.data)
        EX.setmsg(error?.response?.data?.message)
        EX.setCode(error?.response?.status)
    }).finally(()=>
        { return EX;}
     )
    return EX;
}

export const fetchZal= async (searchtext= null) => {
    await $authHost.get('api/zal', {params: {searchtext}}).then((data)=>{
        const {status,statusText}=data
        EX.setZal(data?.data?.zal)
        EX.setmsg(statusText)
        EX.setCode(status)
    }).catch((error) => {
        EX.setZal(error?.response?.data)
        EX.setmsg(error?.response?.data?.message)
        EX.setCode(error?.response?.status)
    }).finally(()=>
        { return EX;}
    )
    return EX;
}

export const fetchOneZal = async (id) => {
    await $authHost.get('api/zal/' + id).then((data)=>{
        const {status,statusText}=data
        EX.setOZal(data?.data?.zal)
        EX.setCode(status)
        EX.setmsg(statusText)
    }).catch((error) => {
        EX.setOZal(error?.response?.data)
        EX.setmsg(error?.response?.data?.message)
        EX.setCode(error?.response?.status)
    }).finally(()=>
        { return EX;}
    )
    return EX;
}


export const updateOneZal = async (id,zal) => {
    await $authHost.put('api/zal/' + id,zal).then((data)=>{
        const {status,statusText}=data
        EX.setOZal(data?.data?.zal)
        EX.setCode(status)
        EX.setmsg(statusText)
    }).catch((error) => {
        EX.setOZal(error?.response?.data)
        EX.setmsg(error?.response?.data?.message)
        EX.setCode(error?.response?.status)
    }).finally(()=>
        { return EX;}
    )
    return EX;
}