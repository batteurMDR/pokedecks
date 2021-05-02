import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
    {
        path: 'all',
        component: ListComponent,
    },
    {
        path: 'search',
        component: ListComponent,
    },
    {
        path: 'view/:id',
        component: ViewComponent,
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/pokemons/all',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ListRoutingModule {}
