import {makeAutoObservable} from "mobx";


export default class BronStore {
    constructor() {
        this._bron = []
        this._totalCount = 0
        this._onebron = []
        this._limit = 6
        this._page = 1
        this._searchtext = ""
        this._triger=false
        this._kod=""
        makeAutoObservable(this)
    }
    setTriger (boolean) {
        this._triger = boolean
    }
    setBron (bron) {
        this._bron = bron
    }
    setOBron (onebron) {
        this._onebron = onebron
    }
    setKod(Kod) {
        this._kod = Kod
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
    setSearchT(string) {
        this._searchtext = string
    }
    get getBron() {
        return this._bron
    }
    get getOBron() {
        return this._onebron
    }
    get getKode(){
        return this._kod
    }
    get getPage() {
        return this._page
    }
    get getLimit() {
        return this._limit
    }
    get gettotalCount() {
        return this._totalCount
    }
    get getSearchT() {
        return this._searchtext
    }
    get getTriger() {
        return this._triger
    }
}