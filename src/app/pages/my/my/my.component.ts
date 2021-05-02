import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { PokeApiService, Pokemon } from 'src/app/services/poke-api.service';

@Component({
    selector: 'app-my',
    templateUrl: './my.component.html',
    styleUrls: ['./my.component.scss'],
})
export class MyComponent implements OnInit, OnDestroy {
    private _subscriptions = new Subscription();

    public pokemons: Pokemon[] = [];

    constructor(
        public pokeApiService: PokeApiService,
        private _localStorageService: LocalStorageService,
        private _router: Router,
        private _route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this._subscriptions.add(
            this._localStorageService.getMyPokemons().subscribe((pokemons) => {
                this.pokemons = pokemons;
            })
        );
    }

    ngOnDestroy(): void {
        this._subscriptions.unsubscribe();
    }

    public goToPokemon(id: number) {
        this._router.navigate(['../', 'pokemons', 'view', id], {
            relativeTo: this._route,
        });
    }
}
