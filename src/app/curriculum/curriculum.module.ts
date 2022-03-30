import { NgModule } from '@angular/core';

import { CurriculumRoutingModule } from './curriculum-routing.module';
import { CurriculumComponent } from './curriculum.component';
import { SharedModule } from './shared/shared.module';
import { MainModule } from './main/main.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ContactModule } from './contact/contact.module';
import { CommonModule } from '@angular/common';
import { CurriculumService } from './curriculum.service';
import { GeneralInfoModule } from './general-info/general-info.module';
import { GenericControlsModule } from '../core/generic-controls/generic-controls.module';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [CurriculumComponent],
  imports: [
    //AngularFontAwesomeModule,
    GenericControlsModule,
    MatDialogModule,
    CommonModule,
    FormsModule,
    CurriculumRoutingModule,
    GeneralInfoModule,
    ContactModule,
    SharedModule,
    MainModule,
    MatSelectModule,
  ],
  providers: [],
  bootstrap: [CurriculumComponent],
})
export class CurriculumModule {}
