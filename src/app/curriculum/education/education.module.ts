import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { EducationComponent } from './education.component';
import { EducationRoutingModule } from './education-routing.module';

@NgModule({
  declarations: [EducationComponent],
  imports: [CommonModule, FormsModule, EducationRoutingModule, MatCardModule],
})
export class EducationModule {}
