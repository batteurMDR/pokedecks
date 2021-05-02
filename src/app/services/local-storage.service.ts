import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { LOCAL_STORAGE_KEY } from '../constants';
import { PokeApiService, Pokemon } from './poke-api.service';

export interface LocalStore {
    myPokemons: number[];
}

@Injectable({
    providedIn: 'root',
})
export class LocalStorageService {
    private _store = new BehaviorSubject<LocalStore>(null);

    constructor(private _pokeApiService: PokeApiService) {
        const localStore = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY));
        if (localStore) {
            this._store.next(localStore);
        } else {
            this._initStorage();
        }
    }

    public getStored() {
        return this._store;
    }

    public getMyPokemons(): Observable<Pokemon[]> {
        return this._store.pipe(mergeMap((stored) => this._pokeApiService.getPokemonsByIds(stored.myPokemons)));
    }

    public addPokemon(pokemonId: number) {
        const localStore = this._store.value;
        localStore.myPokemons.push(pokemonId);
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localStore));
        this._store.next(localStore);
    }

    public removePokemon(pokemonId: number) {
        const localStore = this._store.value;
        localStore.myPokemons = localStore.myPokemons.filter((mp) => mp !== pokemonId);
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localStore));
        this._store.next(localStore);
    }

    private _initStorage() {
        const storage = { myPokemons: [] };
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storage));
        this._store.next(storage);
    }
}
