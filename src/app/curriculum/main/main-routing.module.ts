import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkillsComponent } from '../skills/skills/skills.component';

const routes: Routes = [
  { 
    //path: '', component: MainComponent

    path: 'skills',
    component: SkillsComponent
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
