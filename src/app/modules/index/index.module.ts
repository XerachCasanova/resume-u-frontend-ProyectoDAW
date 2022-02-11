import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { mainComponent } from '../main/main.component';
import { IndexRoutingModule } from './index-routing.module';
import { indexComponent } from './index.component';




@NgModule({
  declarations: [
    indexComponent,
    mainComponent
  ],
  imports: [
    IndexRoutingModule,
    SharedModule

  ],
  exports: [
    indexComponent
  ]

})
export class IndexModule { }
