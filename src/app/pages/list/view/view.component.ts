import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { PokeApiService } from 'src/app/services/poke-api.service';

@Component({
    selector: 'app-view',
    templateUrl: './view.component.html',
    styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit, OnDestroy {
    public pokemonId;
    public pokemon = null;
    public isInPokedecs = false;

    private _subscriptions = new Subscription();

    constructor(
        public pokeApiService: PokeApiService,
        private localStorageService: LocalStorageService,
        private _route: ActivatedRoute
    ) {
        if (this._route.snapshot.paramMap.get('id')) {
            this.pokemonId = this._route.snapshot.paramMap.get('id');
        }
    }

    ngOnInit(): void {
        this._subscriptions.add(
            this.pokeApiService.getPokemonById(this.pokemonId).subscribe((pokemon) => {
                this.pokemon = pokemon;
            })
        );
        this._subscriptions.add(
            this.localStorageService.getStored().subscribe((stored) => {
                if (stored && stored.myPokemons.includes(this.pokemonId)) {
                    this.isInPokedecs = true;
                } else {
                    this.isInPokedecs = false;
                }
            })
        );
    }

    ngOnDestroy(): void {
        this._subscriptions.unsubscribe();
    }

    public getSprites() {
        const sprites = [];
        for (let sprite in this.pokemon.sprites) {
            if (this.pokemon.sprites[sprite] && typeof this.pokemon.sprites[sprite] === 'string') {
                sprites.push(this.pokemon.sprites[sprite]);
            }
        }
        return sprites;
    }

    public getAbilityDescription(ability) {
        for (let entry of ability.effect_entries) {
            if (entry.language.name === 'en') {
                return entry.effect;
            }
        }
    }

    public clickOnButton() {
        if (this.isInPokedecs) {
            this.localStorageService.removePokemon(this.pokemonId);
        } else {
            this.localStorageService.addPokemon(this.pokemonId);
        }
    }
}
