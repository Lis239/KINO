import {makeAutoObservable} from "mobx";


export default class SmensStore {
    constructor() {
        this._smena = []
        this._totalCount = 0
        this._searchtext = ""
        this._onesmena = []
        makeAutoObservable(this)
    }
    setSearchT(searchtext) {
        this._searchtext = searchtext
    }
    setSmena (smena) {
        this._smena = smena
    }
    setOSmena (smena) {
        this._onesmena = smena
    }
    setTotalCount(count) {
        this._totalCount = count
    }
    get getSmena() {
        return this._smena
    }
    get getOSmena() {
        return this._onesmena
    }

    get gettotalCount() {
        return this._totalCount
    }


    get getSearchT() {
        return this._searchtext
    }
}