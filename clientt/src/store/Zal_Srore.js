import {makeAutoObservable} from "mobx";


export default class ZalStore {
    constructor() {
        this._zal = []
        this._totalCount = 0
        this._searchtext = ""
        this._onezal = []
        makeAutoObservable(this)
    }
    setSearchT(searchtext) {
        this._searchtext = searchtext
    }
    setZal (zal) {
        this._zal = zal
    }
    setOZal (zal) {
        this._onezal = zal
    }
    setTotalCount(count) {
        this._totalCount = count
    }
    get getZal() {
        return this._zal
    }
    get getOZal() {
        return this._onezal
    }

    get gettotalCount() {
        return this._totalCount
    }


    get getSearchT() {
        return this._searchtext
    }
}