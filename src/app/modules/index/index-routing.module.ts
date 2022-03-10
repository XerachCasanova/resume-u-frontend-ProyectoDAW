import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { MainComponent } from '../main/main.component';
import { UsersFormComponent } from '../users/users-form.component';
import { indexComponent } from './index.component';

const routes: Routes = [
  {
    path: '',
    component: indexComponent,
    children: [
      {
        path: '',
        component: MainComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'usuario/signup',
        component: UsersFormComponent
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndexRoutingModule {}
