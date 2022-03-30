import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthAdminGuard } from '../login/auth-admin.guard';
import { AdminUsersFormComponent } from './admin-users/admin-users-form/admin-users-form.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { AdminComponent } from './admin.component';
import { LanguagesManageComponent } from './languages-manage/languages-manage.component';


const routes: Routes = [

  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        component: AdminUsersComponent,
        canActivate: [AuthAdminGuard]
      },
      {
        path: 'admin-users',
        component: AdminUsersComponent,
        canActivate: [AuthAdminGuard]
      },
      {
        path: 'admin-users/form',
        component: AdminUsersFormComponent,
        canActivate: [AuthAdminGuard]
      },
      {
        path: 'languages-manage',
        component: LanguagesManageComponent,
        canActivate: [AuthAdminGuard]
      },

    ],
  }
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}



