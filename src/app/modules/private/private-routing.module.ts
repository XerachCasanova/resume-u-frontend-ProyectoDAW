import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthUserGuard } from '../login/auth-user.guard';
import { UsersFormComponent } from '../users/users-form.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { EducationsComponent } from './educations/educations.component';
import { EducationFormComponent } from './educations/education-form/education-form.component';
import { ExperienceFormComponent } from './experiences/experience-form/experience-form.component';
import { ExperiencesComponent } from './experiences/experiences.component';
import { InterestingDataComponent } from './interesting-data/interesting-data.component';
import { LanguageComponent } from './language/language.component';
import { MainComponent } from './main/main.component';
import { PrivateComponent } from './private.component';
import { SkillsComponent } from './skills/skills.component';
import { UsersDataComponent } from './users-data/users-data.component';


const routes: Routes = [

  {
    path: '',
    component: PrivateComponent,
    children: [
      {
        path: '',
        component: MainComponent,
        canActivate: [AuthUserGuard]
      },
      {
        path: 'user-data',
        component: UsersDataComponent,
        canActivate: [AuthUserGuard]
      },
      {
        path: 'interesting-data',
        component: InterestingDataComponent,
        canActivate: [AuthUserGuard]
      },
      {
        path: 'languages',
        component: LanguageComponent,
        canActivate: [AuthUserGuard]
      },
      {
        path: 'skills',
        component: SkillsComponent,
        canActivate: [AuthUserGuard]
      },
      {
        path: 'experience/form',
        component: ExperienceFormComponent,
        canActivate: [AuthUserGuard]
      },
      {
        path: 'experience',
        component: ExperiencesComponent,
        canActivate: [AuthUserGuard]
      },
      {
        path: 'education/form',
        component: EducationFormComponent,
        canActivate: [AuthUserGuard]
      },
      {
        path: 'education',
        component: EducationsComponent,
        canActivate: [AuthUserGuard]
      },
      {
        path: 'configuration',
        component: ConfigurationComponent,
        canActivate: [AuthUserGuard]
      },

    ],
  }
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrivateRoutingModule {}



