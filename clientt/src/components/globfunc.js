
export function isEmpty(value) {
    if(value===null){
        return false
    }
    if(value?.length===0){
        return false
    }

    if(value===''){
        return false
    }
    if(value===undefined){
        return false
    }
    if(value===[]){
        return false
    }
    if(value===""){
        return false
    }
    return true
}


export function strtodata(value) {
    let str=""
    if(isEmpty(value)){
        let dd=value.substring(8,10)
        let mm=value.substring(5,7)
        let yyyy=value.substring(0,4)
        str=dd+"."+mm+"."+yyyy
    }

    return str
}
