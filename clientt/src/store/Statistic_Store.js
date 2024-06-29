import {makeAutoObservable} from "mobx";
export default class StatStore {
    constructor() {
        this._stat = []
        makeAutoObservable(this)
    }

    setStat (stat) {
        this._stat = stat
    }

    get getStat() {
        return this._stat
    }

}