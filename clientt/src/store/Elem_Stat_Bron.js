import {makeAutoObservable} from "mobx";

export default class Elem_Stat_Bron {
    constructor() {
        this._Code=null
        this._bron={}
        this._onebron={}
        this._msg={}
        this._limit=0
        makeAutoObservable(this)
    }
    setCode(int){
        this._Code=int
    }
    setBron(bron){
        this._bron=bron
    }
    setmsg(string){
        this._msg=string
    }
    setOBron(onebron){
        this._onebron=onebron
    }
    setLimit(limit){
        this._limit=limit
    }
    get getLimit(){
        return  this._limit
    }
    get getOBron(){
        return  this._onebron
    }
    get isCode(){
        return   this._Code
    }
    get getBron(){
        return  this._bron
    }
    get getmsg(){
        return  this._msg
    }
}