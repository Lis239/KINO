import {makeAutoObservable} from "mobx";

export default class Elem_Stat_Stat{
    constructor() {
        this._Code=null
        this._stat={}
        this._msg=""
        makeAutoObservable(this)
    }
    setCode(int){
        this._Code=int
    }
    setStat(stat){
        this._stat=stat
    }
    setmsg(string){
        this._msg=string
    }
    get getCode() {
        return this._Code
    }
    get getStat(){
        return  this._stat
    }
    get getmsg(){
        return  this._msg
    }
}