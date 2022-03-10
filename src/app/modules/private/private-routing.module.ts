import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersFormComponent } from '../users/users-form.component';
import { LanguageComponent } from './language/language.component';
import { MainComponent } from './main/main.component';
import { PrivateComponent } from './private.component';
import { UsersDataComponent } from './users-data/users-data.component';


const routes: Routes = [

  {
    path: '',
    component: PrivateComponent,
    children: [
      {
        path: '',
        component: MainComponent,
      },
      {
        path: 'user-data',
        component: UsersDataComponent,
      },
      {
        path: 'languages',
        component: LanguageComponent,
      }

    ],
  }
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrivateRoutingModule {}



