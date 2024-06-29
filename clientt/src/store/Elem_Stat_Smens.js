import {makeAutoObservable} from "mobx";

export default class Elem_Stat_Smens{
    constructor() {
        this._Code=null
        this._smens={}
        this._onesmen={}
        this._msg=''
        makeAutoObservable(this)
    }
    setCode(int){
        this._Code=int
    }
    setSmens(smens){
        this._smens=smens
    }
    setmsg(string){
        this._msg=string
    }
    setOSmena(smen){
        this._onesmen=smen
    }
    get getOSmena(){
        return  this._onesmen
    }
    get getCode() {
        return this._Code
    }
    get getSmens(){
        return  this._smens
    }
    get getmsg(){
        return  this._msg
    }
}