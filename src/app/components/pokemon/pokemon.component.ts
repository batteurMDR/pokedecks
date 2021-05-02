import { Component, Input, OnInit } from '@angular/core';
import { Pokemon } from 'src/app/services/poke-api.service';

@Component({
    selector: 'app-pokemon',
    templateUrl: './pokemon.component.html',
    styleUrls: ['./pokemon.component.scss'],
})
export class PokemonComponent implements OnInit {
    @Input() pokemon: Pokemon = null;

    constructor() {}

    ngOnInit(): void {}
}
