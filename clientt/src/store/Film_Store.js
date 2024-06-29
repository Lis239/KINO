import {makeAutoObservable} from "mobx";


export default class FilmStore {
    constructor() {
        this._film = []
        this._page = 1
        this._totalCount = 0
        this._limit = 6
        this._searchtext = ""
        this._onefilm = []
        makeAutoObservable(this)
    }
    setSearchT(searchtext) {
        this._searchtext = searchtext
    }
    setLimit(limit) {
        this._limit = limit
    }
    setFilm (film) {
        this._film = film
    }
    setOFilm (film) {
        this._onefilm = film
    }
    setPage(page) {
        this._page = page
    }
    setTotalCount(count) {
        this._totalCount = count
    }
    get getFilm() {
        return this._film
    }
    get getOFilm() {
        return this._onefilm
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