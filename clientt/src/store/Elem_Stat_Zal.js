import {makeAutoObservable} from "mobx";

export default class Elem_Stat_Zal{
    constructor() {
        this._Code=null
        this._zal={}
        this._onezal={}
        this._msg={}
        makeAutoObservable(this)
    }
    setCode(int){
        this._Code=int
    }


    setZal(zal){
        this._zal=zal
    }
    setmsg(string){
        this._msg=string
    }
    setOZal(zal){
        this._onezal=zal
    }
    get getOZal(){
        return  this._onezal
    }
    get getCode() {
        return this._Code
    }
    get getZal(){
        return  this._zal
    }
    get getmsg(){
        return  this._msg
    }
}