import {makeAutoObservable} from "mobx";

export default class Main_Stat {
    constructor() {
        this._Code=null
        this._main={}
        this._onemain={}
        this._msg=""
        makeAutoObservable(this)
    }
    setCode(int){
        this._Code=int
    }
    setMain(main){
        this._main=main
    }
    setmsg(string){
        this._msg=string
    }
    setOneMain(string){
        this._onemain=string
    }
    get getOneMain(){
        return this._onemain
    }

    get isCode(){
        return   this._Code
    }
    get getMain(){
        return  this._main
    }

    get getmsg(){
        return  this._msg
    }

}