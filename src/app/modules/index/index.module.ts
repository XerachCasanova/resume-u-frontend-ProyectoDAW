import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { IndexRoutingModule } from './index-routing.module';
import { indexComponent } from './index.component';




@NgModule({
  declarations: [
    indexComponent,
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
