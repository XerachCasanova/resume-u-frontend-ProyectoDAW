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
import {MatTableDataSource} from '@angular/material/table';
import { SharedModule } from 'src/app/shared/shared.module';
import { InterestingDataComponent } from './interesting-data/interesting-data.component';
import { LanguageComponent } from './language/language.component';
import { PrivateRoutingModule } from './private-routing.module';
import { PrivateComponent } from './private.component';
import { SkillsComponent } from './skills/skills.component';
import { UsersDataComponent } from './users-data/users-data.component';
import { ExperiencesComponent } from './experiences/experiences.component';
import { ExperienceFormComponent } from './experiences/experience-form/experience-form.component';
import {MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { EducationsComponent } from './educations/educations.component';
import { EducationFormComponent } from './educations/experience-form/education-form.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { MainComponent } from './main/main.component';
import {MatTabsModule} from '@angular/material/tabs';
import { SkillsChartsModule } from 'src/app/core/skills-charts/skills-chats.module';
import { AuthUserGuard } from '../login/auth-user.guard';

@NgModule({
  declarations: [
    PrivateComponent,
    ConfigurationComponent,
    UsersDataComponent,
    LanguageComponent,
    InterestingDataComponent,
    SkillsComponent,
    MainComponent,
    ExperiencesComponent,
    ExperienceFormComponent,
    EducationsComponent,
    EducationFormComponent,
  ],
  imports: [
    SkillsChartsModule,
    MatTabsModule,
    PrivateRoutingModule,
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
  exports: [PrivateComponent],
  providers: [
    [AuthUserGuard],
    {provide: MAT_DATE_LOCALE, useValue: 'es-ES'},
  ],
})
export class PrivateModule {}
