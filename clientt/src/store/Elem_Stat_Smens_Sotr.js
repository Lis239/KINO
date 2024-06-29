import {makeAutoObservable} from "mobx";

export default class Elem_Stat_Smens_Sotr{
    constructor() {
        this._Code=null
        this._SmensSotr={}
        this._sotr={}
        this._msg={}
        makeAutoObservable(this)
    }
    setCode(int){
        this._Code=int
    }
    setSmensSotr(smens){
        this._SmensSotr=smens
    }

    setSotr(Sotr){
        this._sotr=Sotr
    }
    setmsg(string){
        this._msg=string
    }

    get getCode() {
        return this._Code
    }
    get getSmensSotr(){
        return  this._SmensSotr
    }
    get getSotr(){
        return  this._sotr
    }
    get getmsg(){
        return  this._msg
    }
}