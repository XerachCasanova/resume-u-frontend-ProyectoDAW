import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { GeneralInfoComponent } from './general-info.component';
import { MatIconModule } from '@angular/material/icon';
import { GeneralInfoRoutingModule } from './general-info-routing.module';

@NgModule({
  declarations: [GeneralInfoComponent],
  imports: [CommonModule, FormsModule, MatCardModule,  GeneralInfoRoutingModule, MatIconModule],
})
export class GeneralInfoModule {}
