import {makeAutoObservable} from "mobx";


export default class BiletStore {
    constructor() {
        this._bilet = []
        this._totalCount = 0
        this._onebilet = []
        this._limit = 6
        this._mesto=null;
        this._mesta=[];
        this._rad=null;
        this._radmesto=null;
        this._maxcoll=10;
        this._triger=false;
        this._searchtext = ""
        this._page = 1
        this._mestabuy = []
        this._mestabron= []
        this._formData=new FormData()
        makeAutoObservable(this)
    }
    setformData(formData){
        this._formData=formData
    }
    setMestaBuy(mestabuy){
        this._mestabuy=mestabuy
    }
    setMestaBron(mestabron){
        this._mestabron=mestabron
    }
    setBilet (bilet) {
        this._bilet = bilet
    }
    setOBilet (onebilet) {
        this._onebilet = onebilet
    }
    setTriger (boolean) {
        this._triger = boolean
    }
    setRad (rad) {
        if (rad!=null) {this._rad = rad+1}
        else {this._rad=null}
    }
    setMesto (mesto) {
        this._mesto = mesto
    }
    setMesta (mesta) {
        this._mesta = mesta
    }
    setRadmesto (radmesto) {
        this._radmesto = radmesto
    }
    setSearchT(string) {
        this._searchtext = string
    }
    set_maxcoll(maxcoll) {
        this._maxcoll = maxcoll
    }
    setTotalCount(count) {
        this._totalCount = count
    }
    setLimit(limit) {
        this._limit = limit
    }
    setPage(page) {
        this._page = page
    }
    get getLimit() {
        return this._limit
    }
    get getTriger() {
        return this._triger
    }
    get getBilet() {
        return this._bilet
    }
    get getOBilet() {
        return this._onebilet
    }

    get get_maxcoll() {
        return this._maxcoll
    }
    get getPage() {
        return this._page
    }
    get getMesto() {
        return this._mesto
    }
    get getMesta() {
        return this._mesta
    }
    get getRad() {
        return this._rad
    }

    get getRadmesto() {
        return this._radmesto
    }
    get gettotalCount() {
        return this._totalCount
    }
    get getSearchT() {
        return this._searchtext
    }
    get getformData(){
        return this._formData
    }
    get getMestaBuy(){
        return  this._mestabuy
    }
    get getMestaBron(){
        return  this._mestabron
    }

}