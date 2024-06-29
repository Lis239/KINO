import {$authHost} from "./index";
import Elem_Stat_Film from "../store/Elem_Stat_Film";

const EX=new Elem_Stat_Film({},null,"")

export const сreateFilm = async (film) => {
    await $authHost.post('api/film', film).then((data)=>{
    const {status,statusText}=data
    EX.setFilm(data)
    EX.setmsg(statusText)
    EX.setCode(status)
}).catch((error) => {
    EX.setFilm(error.response.data)
    EX.setmsg(error.response.data.message)
    EX.setCode(error.response.status)
}).finally(()=> { return EX;})
return EX}



export const fetchFilms = async (page, limit= 3,searchtext= null) => {
    await $authHost.get('api/film', {params: {page, limit,searchtext}}).then((data)=>{
        const {status,statusText}=data
        EX.setFilm(data.data.film)
        EX.setmsg(statusText)
        EX.setCode(status)
    }).catch((error) => {
        EX.setFilm(error.response.data)
        EX.setmsg(error.response.data.message)
        EX.setCode(error.response.status)
    })

    return EX
}


export const fetchOneFilm = async (id) => {
    await $authHost.get('api/film/' + id).then((data)=>{
        const {status,statusText}=data
        EX.setOFilm(data.data.film)
        EX.setCode(status)
        EX.setmsg(statusText)
    }).catch((error) => {
        EX.setOFilm(error.response.data)
        EX.setCode(error.response.data.status)
        EX.setmsg(error.response.data.message)
    })

    return EX
}


export const updateOneFilm = async (id,film) => {
    await $authHost.put('api/film/' + id,film).then((data)=>{
        const {status,statusText}=data
        EX.setOFilm(data.data.film)
        EX.setCode(status)
        EX.setmsg(statusText)
    }).catch((error) => {
        EX.setOFilm(error.response.data)
        EX.setCode(error.response.data.status)
        EX.setmsg(error.response.data.message)
    })

    return EX
}

export const delOneInfo = async (id) => {
    await $authHost.delete('api/film/info/' + id).then((data)=>{
        const {status,statusText}=data
        EX.setCode(status)
        EX.setmsg(statusText)
    }).catch((error) => {
        EX.setCode(error.response.data.status)
        EX.setmsg(error.response.data.message)
    })

    return EX
}