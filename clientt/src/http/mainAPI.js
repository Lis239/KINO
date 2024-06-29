import {$host} from "./index";
import Elem_Main from "../store/Main_Stat";

const EX=new Elem_Main(null,{},{},"")


export const fetchMain = async (page, limit=3,searchtext= null) => {
    await $host.get('api/main', {params: {page, limit,searchtext}}).then((data)=>{
        const {status,statusText}=data
        EX.setMain(data.data)
        EX.setmsg(statusText)
        EX.setCode(status)
    }).catch((error) => {
        EX.setMain(error.response.data)
        EX.setmsg(error.response.data.message)
        EX.setCode(error.response.status)
    })
    return EX
}

export const fetchOneMain = async (id,date) => {
    await $host.get('api/main/'+id+'/'+date, {params: {id,date}}).then((data)=>{
        const {status,statusText}=data
        EX.setOneMain(data.data)
        EX.setmsg(statusText)
        EX.setCode(status)
    }).catch((error) => {
        EX.setOneMain(error.response.data)
        EX.setmsg(error.response.data.message)
        EX.setCode(error.response.status)
    })
    return EX
}