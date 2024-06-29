import {makeAutoObservable} from "mobx";

export default class Elem_Stat_Film {
    constructor() {
        this._Code=null
        this._film={}
        this._onefilm={}
        this._msg={}
        makeAutoObservable(this)
    }
    setCode(int){
        this._Code=int
    }
    setFilm(film){
        this._film=film
    }
    setmsg(string){
        this._msg=string
    }
    setOFilm(film){
        this._onefilm=film
    }
    get getOFilm(){
        return  this._onefilm
    }
    get isCode(){
        return   this._Code
    }
    get getFilm(){
        return  this._film
    }
    get getmsg(){
        return  this._msg
    }
}