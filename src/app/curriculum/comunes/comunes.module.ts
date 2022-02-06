import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import { CurriculumRoutingModule } from '../curriculum-routing.module';



@NgModule({
  declarations: [
    HeaderComponent
  ],
  imports: [
    CommonModule,
    CurriculumRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDialogModule,
  ],
  exports: [
    HeaderComponent
  ]
})
export class ComunesModule { }
