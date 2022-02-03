import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { 
    //path: 'main', loadChildren: () => import('./main/main.module').then(m => m.MainModule) 
    path: 'skills',
    loadChildren: () => import('./skills/skills.module').then(m => m.SkillsModule)
  },
  { path: 'contacto', 
  loadChildren: () => import('./contacto/contacto.module').then(m => m.ContactoModule) },
  { path: 'experiencia', loadChildren: () => import('./experiencia/experiencia.module').then(m => m.ExperienciaModule) },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
