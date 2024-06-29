import {makeAutoObservable} from "mobx";


export default class SeansStore {
    constructor() {
        this._seans = []
        this._page = 1
        this._totalCount = 0
        this._limit = 6
        this._searchtext = ""
        this._oneseans = []
        this._selectedFilm = {}
        this._selectedZal= {}
        this._reload=false
        makeAutoObservable(this)
    }
    setSearchT(searchtext) {
        this._searchtext = searchtext
    }
    setLimit(limit) {
        this._limit = limit
    }
    setZALID(id) {
        this._selectedZal = id
    }
    setFILMID(id) {
        this._selectedFilm = id
    }

    setSeans (seans) {
        this._seans = seans
    }
    setOSeans (seans) {
        this._oneseans = seans
    }
    setPage(page) {
        this._page = page
    }
    setTotalCount(count) {
        this._totalCount = count
    }
    setReload(count) {
        this._reload = count
    }
    get getReload() {
        return this._reload
    }
    get getSeans() {
        return this._seans
    }
    get getOSeans() {
        return this._oneseans
    }
    get getZALID() {
        return this._selectedZal
    }
    get getFILMID() {
        return this._selectedFilm
    }
    get gettotalCount() {
        return this._totalCount
    }
    get getPage() {
        return this._page
    }
    get getLimit() {
        return this._limit
    }
    get getSearchT() {
        return this._searchtext
    }
}