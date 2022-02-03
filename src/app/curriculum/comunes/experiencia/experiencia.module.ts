import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExperienciaRoutingModule } from './experiencia-routing.module';
import { ExperienciaComponent } from './experiencia.component';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ExperienciaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ExperienciaRoutingModule,

    MatCardModule
  ]
})
export class ExperienciaModule { }
