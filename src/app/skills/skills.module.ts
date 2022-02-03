import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillsComponent } from './skills/skills.component';
import { SkillRoutingModule } from './skills/skills-routing.module';
import { NgApexchartsModule } from "ng-apexcharts";
import { FormsModule } from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import { DelayDirective } from './skills/delay.directive';


@NgModule({
  declarations: [
    SkillsComponent,
    DelayDirective
    
  ],
  imports: [
    CommonModule,
    SkillRoutingModule,
    FormsModule,
    NgApexchartsModule,
    MatCardModule
    
    
  ], exports: [
    SkillsComponent
    
  ]
})
export class SkillsModule { }
