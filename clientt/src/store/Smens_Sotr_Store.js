import {makeAutoObservable} from "mobx";

export default class SmenaSotrStore {
    constructor() {
        this._smena = []
        this._sotr = []
        this._smensotr = []
        this._selectedSmena = {}
        this._selectedSotr = {}
        this._reload=false
        makeAutoObservable(this)
    }

    setSmena(smena) {
        this._smena = smena
    }

    setSotr(sotr) {
        this._sotr = sotr
    }
    setSmensotr(smensotr) {
        this._smensotr = smensotr
    }

    setSelectedSmena(smena) {
        this._selectedSmena = smena
    }
    setSelectedSotr(sotr) {
        this._selectedSotr = sotr
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
    get getsmena() {
        return this._smena
    }
    get sotr() {
        return this._sotr
    }


    get selectedSmena() {
        return this._selectedSmena
    }
    get selectedSotr() {
        return this._selectedSotr
    }
    get getSmenaSotr(){
        return this._smensotr
    }

}


