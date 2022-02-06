import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkillsComponent } from '../skills/skills.component';
import { MainComponent } from './main.component';

const routes: Routes = [
  { 
    path: '', component: MainComponent
    //path: '',
    //component: SkillsComponent
  },

  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
