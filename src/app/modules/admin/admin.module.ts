import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ValidatorsModule } from 'src/app/core/validators/validators.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import { SharedModule } from 'src/app/shared/shared.module';
import {MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import { SkillsChartsModule } from 'src/app/core/skills-charts/skills-chats.module';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { AdminUsersFormComponent } from './admin-users/admin-users-form/admin-users-form.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { LanguagesManageComponent } from './languages-manage/languages-manage.component';
import { AuthAdminGuard } from '../login/auth-admin.guard';


@NgModule({
  declarations: [
    AdminComponent,
    AdminUsersComponent,
    AdminUsersFormComponent,
    LanguagesManageComponent
  ],
  imports: [

    SkillsChartsModule,
    MatTabsModule,
    AdminRoutingModule,
    MatDatepickerModule,
    MatPaginatorModule,
    MatNativeDateModule,
    MatSortModule,
    SharedModule,
    ReactiveFormsModule,
    MatButtonModule,
    FormsModule,
    ValidatorsModule,
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatDialogModule,
    MatIconModule,
    MatSelectModule,
  ],
  exports: [AdminComponent],
  providers: [
    [AuthAdminGuard],
    {provide: MAT_DATE_LOCALE, useValue: 'es-ES'},
  ],
})
export class AdminModule {}
