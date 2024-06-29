import {$authHost} from "./index";
import Elem_Users from "../store/Elem_Users";
import Elem_Stat_Smens_Sotr from "../store/Elem_Stat_Smens_Sotr";
const EX=new Elem_Users(null,{},{},"")
const EEX=new Elem_Stat_Smens_Sotr(null,{},{},{},"")

export const fetchUsersRol= async (rol) => {
    await $authHost.get('api/users/', {params: {rol}}).then((data)=>{
        const {status,statusText}=data
        EX.setUsers(data.data.users)
        EX.setmsg(statusText)
        EX.setCode(status)
    }).catch((error) => {
        EX.setUsers(error.response.data)
        EX.setmsg(error.response.data.message)
        EX.setCode(error.response.status)
    })

    return EX
}


export const createSmensSotr = async (SmensSotr) => {
    await $authHost.post('api/smenasotr', SmensSotr).then((data)=>{
        const {status,statusText}=data
        EEX.setSotr(data)
        EEX.setmsg(statusText)
        EEX.setCode(status)
    }).catch((error) => {
        EEX.setSotr(error?.response?.data)
        EEX.setmsg(error?.response?.data?.message)
        EEX.setCode(error?.response?.status)
    }).finally(()=>
        { return EEX;}
    )
    return EEX;
}




export const fetchSmenaSotr= async (date) => {
    await $authHost.get('api/smenasotr/', {params: {date}}).then((data)=>{
        const {status,statusText}=data
        EEX.setSmensSotr(data.data.smenasotr)
        EEX.setmsg(statusText)
        EEX.setCode(status)
    }).catch((error) => {
        EEX.setSmensSotr(error.response.data)
        EEX.setmsg(error.response.data.message)
        EEX.setCode(error.response.status)
    })

    return EEX
}



export const delOneSmenaSotr = async (id) => {
    await $authHost.delete('api/smenasotr/' + id).then((data)=>{
        const {status,statusText}=data
        EX.setCode(status)
        EX.setmsg(statusText)
    }).catch((error) => {
        EX.setCode(error.response.data.status)
        EX.setmsg(error.response.data.message)
    })

    return EX
}

