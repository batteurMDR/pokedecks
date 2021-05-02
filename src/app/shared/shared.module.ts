import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PokemonListComponent } from '../components/pokemon-list/pokemon-list.component';
import { PokemonComponent } from '../components/pokemon/pokemon.component';

@NgModule({
    declarations: [PokemonComponent, PokemonListComponent],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
    exports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, PokemonComponent, PokemonListComponent],
})
export class SharedModule {}
