import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/index/index.module').then(m => m.IndexModule)
  },
  {
    path: 'curriculum.de',
    loadChildren: () => import('./curriculum/curriculum.module').then(m => m.CurriculumModule)
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
