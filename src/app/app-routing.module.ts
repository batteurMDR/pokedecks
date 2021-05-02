import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'pokemons',
        loadChildren: () => import('./pages/list/list.module').then((m) => m.ListModule),
    },
    {
        path: 'my-pokemons',
        loadChildren: () => import('./pages/my/my.module').then((m) => m.MyModule),
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/pokemons/all',
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
