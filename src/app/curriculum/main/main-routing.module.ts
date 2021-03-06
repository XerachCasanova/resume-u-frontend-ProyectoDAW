import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'skills',
        loadChildren: () =>
          import('../skills/skills.module').then((m) => m.SkillsModule),
      },
      {
        path: 'contact',
        loadChildren: () =>
          import('../contact/contact.module').then((m) => m.ContactModule),
      },
      {
        path: 'experience',
        loadChildren: () =>
          import('../experience/experience.module').then(
            (m) => m.ExperienceModule
          ),
      },
      {
        path: 'education',
        loadChildren: () =>
          import('../education/education.module').then(
            (m) => m.EducationModule
          ),
      },
      {
        path: 'aboutme',
        loadChildren: () =>
          import('../general-info/general-info.module').then((m) => m.GeneralInfoModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
