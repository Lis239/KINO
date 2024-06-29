import {makeAutoObservable} from "mobx";

export default class Elem_Stat {
    constructor() {
        this._Code=null
        this._user={}
        this._msg={}
        makeAutoObservable(this)
    }
    setCode(int){
        this._Code=int
    }
    setUser(user){
        this._user=user
    }
    get isCode(){
        return   this._Code
    }
    get getUser(){
        return  this._user
    }
    setmsg(string){
        this._msg=string
    }
    get getmsg(){
        return  this._msg
    }

}