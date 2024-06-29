import {$authHost} from "./index";
import Elem_Users from "../store/Elem_Users";
const EX=new Elem_Users(null,{},{},"")

export const fetchUsers= async (page, limit= 3,searchtext= null) => {
    await $authHost.get('api/users', {params: {page, limit,searchtext}}).then((data)=>{
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
export const fetchOneUser = async (id) => {
    await $authHost.get('api/users/' + id).then((data)=>{
        const {status,statusText}=data
        EX.setOUser(data.data.user)
        EX.setCode(status)
        EX.setmsg(statusText)
    }).catch((error) => {
        EX.setOUser(error.response.data)
        EX.setCode(error.response.data.status)
        EX.setmsg(error.response.data.message)
    })

    return EX
}
export const updateOneUser = async (id,user) => {
    await $authHost.put('api/users/' + id,user).then((data)=>{
        const {status,statusText}=data
        EX.setOUser(data.data.user)
        EX.setCode(status)
        EX.setmsg(statusText)
    }).catch((error) => {
        EX.setOUser(error.response.data)
        EX.setCode(error.response.data.status)
        EX.setmsg(error.response.data.message)
    })

    return EX
}



