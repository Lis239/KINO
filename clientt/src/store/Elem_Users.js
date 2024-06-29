import {makeAutoObservable} from "mobx";

export default class Elem_Users {
    constructor() {
        this._Code=null
        this._users={}
        this._oneuser={}
        this._msg=""
        makeAutoObservable(this)
    }
    setCode(int){
        this._Code=int
    }
    setUsers(users){
        this._users=users
    }
    setmsg(string){
        this._msg=string
    }
    setOUser(user){
        this._oneuser=user
    }
    get getOUser(){
        return  this._oneuser
    }
    get isCode(){
        return   this._Code
    }
    get getUsers(){
        return  this._users
    }
    get getmsg(){
        return  this._msg
    }
}