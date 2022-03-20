import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersFormComponent } from '../users/users-form.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { EducationsComponent } from './educations/educations.component';
import { EducationFormComponent } from './educations/experience-form/education-form.component';
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
      },
      {
        path: 'configuration',
        component: ConfigurationComponent,
      },
      {
        path: 'user-data',
        component: UsersDataComponent,
      },
      {
        path: 'interesting-data',
        component: InterestingDataComponent,
      },
      {
        path: 'languages',
        component: LanguageComponent,
      },
      {
        path: 'skills',
        component: SkillsComponent,
      },
      {
        path: 'experience/form',
        component: ExperienceFormComponent,
      },
      {
        path: 'experience',
        component: ExperiencesComponent,
      },
      {
        path: 'education/form',
        component: EducationFormComponent,
      },
      {
        path: 'education',
        component: EducationsComponent,
      },





    ],
  }
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrivateRoutingModule {}



