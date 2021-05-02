import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { mergeMap, pluck } from 'rxjs/operators';
import { PokeApiService, Pokemon } from 'src/app/services/poke-api.service';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit, OnDestroy {
    public search = false;
    private _subscriptions = new Subscription();

    public pokemons: Pokemon[] = [];

    constructor(public pokeApiService: PokeApiService, private _router: Router, private _route: ActivatedRoute) {}

    ngOnInit(): void {
        this._subscriptions.add(
            this._route.queryParams
                .pipe(
                    pluck('search'),
                    mergeMap((search) => {
                        if (search) {
                            this.search = true;
                            return this.pokeApiService.getPokemon(search);
                        } else {
                            this.search = false;
                            return this.pokeApiService.getPokemons();
                        }
                    })
                )
                .subscribe((pokemons) => {
                    this.pokemons = pokemons;
                })
        );
    }

    ngOnDestroy(): void {
        this._subscriptions.unsubscribe();
    }

    public goPrev() {
        if (this.pokeApiService.canGoPrevious) {
            this.pokeApiService.goPrev();
        }
    }

    public goNext() {
        if (this.pokeApiService.canGoNext) {
            this.pokeApiService.goNext();
        }
    }

    public goToPokemon(id: number) {
        this._router.navigate(['../', 'view', id], {
            relativeTo: this._route,
        });
    }
}
