import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';

const routes: Routes = [
  { 
    path: '', component: MainComponent,
    children: [
      
      { 
        path: 'skills', 
        loadChildren: () => import('../skills/skills.module').then(m => m.SkillsModule),
      },
      { 
        path: 'contact', 
        loadChildren: () => import('../contact/contact.module').then(m => m.ContactModule),
      },
      { 
        path: 'experience', 
        loadChildren: () => import('../experience/experiencia.module').then(m => m.ExperienceModule),
      }
      
    ]
  },
  

  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
