import { NgModule } from '@angular/core';
import { MyComponent } from './my/my.component';
import { MyRoutingModule } from './my-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
    declarations: [MyComponent],
    imports: [SharedModule, MyRoutingModule],
})
export class MyModule {}
