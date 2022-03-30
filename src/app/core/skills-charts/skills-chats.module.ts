import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { DelayDirective } from './delay.directive';
import { SkillsChartsComponent } from 'src/app/core/skills-charts/skills-charts.component';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [SkillsChartsComponent, DelayDirective],
  imports: [
    CommonModule,
    FormsModule,
    NgApexchartsModule,
    MatCardModule,
    MatSelectModule
  ],
  exports: [SkillsChartsComponent],
})
export class SkillsChartsModule {}
