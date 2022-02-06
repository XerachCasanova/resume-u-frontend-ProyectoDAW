import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurriculumComponent } from './curriculum.component';

const routes: Routes = [
  {
    path: '',
    component: CurriculumComponent,
    children: [
      { 
        path: '',
        loadChildren: () => import('./skills/skills.module').then(m => m.SkillsModule),
      },
      { 
        path: 'skills',
        loadChildren: () => import('./skills/skills.module').then(m => m.SkillsModule),
      },
      { 
        path: 'contacto', 
        loadChildren: () => import('./contacto/contacto.module').then(m => m.ContactoModule),
      },
      { 
        path: 'experiencia', 
        loadChildren: () => import('./experiencia/experiencia.module').then(m => m.ExperienciaModule),
      }
      
    ]
  },
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CurriculumRoutingModule { }
