import {makeAutoObservable} from "mobx";


export default class Users_Store {
    constructor() {
        this._users = []
        this._page = 1
        this._totalCount = 0
        this._limit = 6
        this._searchtext = ""
        this._oneuser = []
        this._selected_ID=null
        makeAutoObservable(this)
    }

    setSelID(count) {
        this._selected_ID = count
    }


    setSearchT(searchtext) {
        this._searchtext = searchtext
    }
    setLimit(limit) {
        this._limit = limit
    }
    setUsers (users) {
        this._users = users
    }
    setOUser (user) {
        this._oneuser = user
    }
    setPage(page) {
        this._page = page
    }
    setTotalCount(count) {
        this._totalCount = count
    }
    get getUsers() {
        return this._users
    }
    get getOUser() {
        return this._oneuser
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
    get getSelID() {
        return this._selected_ID
    }

}