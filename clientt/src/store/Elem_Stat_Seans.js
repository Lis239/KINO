import {makeAutoObservable} from "mobx";

export default class Elem_Stat_Seans{
    constructor() {
        this._Code=null
        this._seans={}
        this._oneseans={}
        this._msg=''
        makeAutoObservable(this)
    }
    setCode(int){
        this._Code=int
    }
    setSeans(seans){
        this._seans=seans
    }
    setmsg(string){
        this._msg=string
    }
    setOSeans(seans){
        this._oneseans=seans
    }
    get getOSeans(){
        return  this._oneseans
    }
    get getCode() {
        return this._Code
    }
    get getSeans(){
        return  this._seans
    }
    get getmsg(){
        return  this._msg
    }
}