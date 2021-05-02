import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Pokemon } from 'src/app/services/poke-api.service';

@Component({
    selector: 'app-pokemon-list',
    templateUrl: './pokemon-list.component.html',
    styleUrls: ['./pokemon-list.component.scss'],
})
export class PokemonListComponent implements OnInit {
    @Input() pokemons: Pokemon[] = [];
    @Output() pokemonClicked = new EventEmitter<number>();

    constructor() {}

    ngOnInit(): void {}
}
