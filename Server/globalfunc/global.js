function isEmpty(value) {
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
module.exports = { isEmpty };