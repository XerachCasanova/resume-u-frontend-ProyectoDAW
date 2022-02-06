import { NgModule } from '@angular/core';

import { CurriculumRoutingModule } from './curriculum-routing.module';
import { CurriculumComponent } from './curriculum.component';
import { ComunesModule } from './comunes/comunes.module';
import { MainModule } from './main/main.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ContactoModule } from './contacto/contacto.module';

@NgModule({
  declarations: [
    CurriculumComponent,
  ],
  imports: [
    FormsModule,
    CurriculumRoutingModule,
    ContactoModule,
    ComunesModule,
    MainModule,
    MatSelectModule

  ],
  providers: [],
  bootstrap: [CurriculumComponent]
})
export class CurriculumModule { }
