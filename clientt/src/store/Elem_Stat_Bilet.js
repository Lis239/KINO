import {makeAutoObservable} from "mobx";

export default class Elem_Stat_Bilet {
    constructor() {
        this._Code=null
        this._bilet={}
        this._onebilet={}
        this._msg=""
        this._mesta=[]
        this._mestabuy=[]
        this._mestabron=[]
        makeAutoObservable(this)
    }
    setCode(int){
        this._Code=int
    }
    setBilet(bilet){
        this._bilet=bilet
    }
    setMesta(mesta){
        this._mesta=mesta
    }
    setmsg(string){
        this._msg=string
    }
    setOBilet(onebilet){
        this._onebilet=onebilet
    }
    setmestabuy(mestabuy){
        this._mestabuy=mestabuy
    }
    setmestabron(mestabron){
        this._mestabron=mestabron
    }
    get getMesta(){
        return  this._mesta
    }
    get getOBilet(){
        return  this._onebilet
    }
    get isCode(){
        return   this._Code
    }
    get getBilet(){
        return  this._bilet
    }
    get getmsg(){
        return  this._msg
    }
    get getmestabuy(){
        return  this._mestabuy
    }
    get getmestabron(){
        return  this._mestabron
    }
}