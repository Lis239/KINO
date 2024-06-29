import {makeAutoObservable} from "mobx";

export default class Main_Store {
    constructor() {
        this._main = []
        this._maindate = ""
        this._page = 1
        this._totalCount = 0
        this._limit = 9
        this._searchtext = ""
        this._omain = []
        this._selectoseans = null
        this._selmain = []
        makeAutoObservable(this)
    }
    setSearchT(searchtext) {
        this._searchtext = searchtext
    }
    setMain (main) {
        this._main = main
    }
    setMainDate (MainDate) {
        this._maindate = MainDate
    }
    setLimit(limit) {
        this._limit = limit
    }
    setPage(page) {
        this._page = page
    }
    setOMain (main) {
        this._omain = main
    }
    setSelMain (main) {
        this._selmain = main
    }
    setTotalCount(count) {
        this._totalCount = count
    }
    setSelectOSeans(selectoseans) {
        this._selectoseans = selectoseans
    }
    get getSelectOSeans() {
        return this._selectoseans
    }
    get getMain() {
        return this._main
    }
    get getOMain() {
        return this._omain
    }
    get getSelMain() {
        return this._selmain
    }
    getMainDate (MainDate) {
        return this._maindate
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