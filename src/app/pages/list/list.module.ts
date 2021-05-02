import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';
import { ListRoutingModule } from './list-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
    declarations: [ListComponent, ViewComponent],
    imports: [SharedModule, ListRoutingModule],
})
export class ListModule {}
