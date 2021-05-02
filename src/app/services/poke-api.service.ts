import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, mergeMap, pluck, tap } from 'rxjs/operators';

export interface PokemonAbility {
    ability: PokeApiTarget;
    is_hidden: boolean;
    slot: number;
}

export interface PokemonIndex {
    version: PokeApiTarget;
    game_index: number;
}

export interface PokemonStat {
    stat: PokeApiTarget;
    base_stat: number;
    effort: number;
}

export interface PokemonType {
    type: PokeApiTarget;
    slot: number;
}

export interface Pokemon {
    abilities: PokemonAbility[];
    base_experience: number;
    forms: PokeApiTarget[];
    game_indices: PokemonIndex[];
    height: number;
    held_items: any[];
    id: number;
    is_default: boolean;
    location_area_encounters: string;
    moves: any[];
    name: string;
    order: number;
    past_types: any[];
    species: PokeApiTarget;
    sprites: {
        back_default: string;
        back_female: string;
        back_shiny: string;
        back_shiny_female: string;
        front_default: string;
        front_female: string;
        front_shiny: string;
        front_shiny_female: string;
        other: any;
        versions: any;
    };
    stats: PokemonStat[];
    types: PokemonType[];
    weight: number;
}

export interface PokeApiTarget {
    name: string;
    url: string;
}

export interface PokeApiListResponse {
    count: number;
    next: string;
    previous: string;
    results: PokeApiTarget[];
}

@Injectable({
    providedIn: 'root',
})
export class PokeApiService {
    private _pokemons = new BehaviorSubject<Pokemon[]>([]);
    private _offset = new BehaviorSubject(0);

    public canGoPrevious = false;
    public canGoNext = false;

    constructor(private http: HttpClient) {
        this._getCurrentRangePokemonsFromApi();
    }

    public getPokemons() {
        return this._pokemons;
    }

    public getPokemonsByIds(ids: number[]) {
        return combineLatest<Pokemon[]>(ids.map((id) => this.http.get(`https://pokeapi.co/api/v2/pokemon/${id}`)));
    }

    public getPokemon(pokemonToSearch: string) {
        return this.http.get<PokeApiListResponse>(`https://pokeapi.co/api/v2/pokemon?limit=1118`).pipe(
            pluck('results'),
            map((results) => results.filter((r) => r.name.toLowerCase().includes(pokemonToSearch.toLocaleLowerCase()))),
            mergeMap((results) => combineLatest(results.map((r) => this.http.get<Pokemon>(r.url))))
        );
    }

    public getPokemonById(pokemonId: number) {
        return this.http.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`).pipe(
            mergeMap((pokemon) =>
                combineLatest([
                    combineLatest([...pokemon.abilities.map((a) => this.http.get(a.ability.url))]),
                    combineLatest([...pokemon.forms.map((f) => this.http.get(f.url))]),
                    combineLatest([...pokemon.game_indices.map((gi) => this.http.get(gi.version.url))]),
                    this.http.get(pokemon.species.url),
                    combineLatest([...pokemon.stats.map((s) => this.http.get(s.stat.url))]),
                    combineLatest([...pokemon.types.map((t) => this.http.get(t.type.url))]),
                ]).pipe(
                    map(([abilities, forms, game_indices, species, stats, types]) => ({
                        ...pokemon,
                        abilities,
                        forms,
                        game_indices,
                        species,
                        stats,
                        types,
                    }))
                )
            )
        );
    }

    public goNext() {
        this._offset.next(this._offset.value + 1);
    }

    public goPrev() {
        this._offset.next(this._offset.value - 1);
    }

    private _getCurrentRangePokemonsFromApi() {
        this._offset.subscribe((offset) => {
            this.http
                .get<PokeApiListResponse>(`https://pokeapi.co/api/v2/pokemon?offset=${offset * 24}&limit=24`)
                .pipe(
                    tap((results) => {
                        this.canGoNext = !!results.next;
                        this.canGoPrevious = !!results.previous;
                    }),
                    pluck('results'),
                    mergeMap((results) => combineLatest(results.map((r) => this.http.get<Pokemon>(r.url))))
                )
                .subscribe((results) => {
                    this._pokemons.next(results);
                });
        });
    }
}
