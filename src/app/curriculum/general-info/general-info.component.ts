import { Component, OnInit } from '@angular/core';
import { InterestingData } from 'src/app/core/models/interfaces/interesting-data';
import { Skill } from 'src/app/core/models/interfaces/skill';
import { User } from 'src/app/core/models/interfaces/user';
import { SkillsService } from 'src/app/modules/private/skills/skills.service';
import { UsersService } from 'src/app/modules/users/users.service';
import { CurriculumColorsService } from '../curriculum-colors.service';
import { CurriculumService } from '../curriculum.service';


@Component({
  selector: 'curriculum-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.scss'],
})
export class GeneralInfoComponent implements OnInit {
  acercaDe: string;
  languages: any[] = [];
  gamaColores: any;
  interestingData: InterestingData[] = [];
  skills: Skill[] = [];
  constructor(
    private curriculumService: CurriculumService,
    private usersService: UsersService,
    private skillsService: SkillsService,
    private curriculumColorsService:CurriculumColorsService
  ) {


  }

  ngOnInit(): void {

    this.curriculumService.currentCurriculum$.subscribe(async (curriculum) => {
      //El valor inicial del behaviorSubject es un curriculum sin datos, cuya id es = 0, se debe evitar una petición al back con ese curriculum.
      if (curriculum.idCurriculum && curriculum.idCurriculum != "0") {
        this.gamaColores = this.curriculumColorsService.buildColorRange(curriculum.gamaColores);
        this.usersService.getUser(curriculum.idUsuario).subscribe((user: User[]) => {
          if(user[0].acercaDe) this.acercaDe = user[0].acercaDe;

        });
      }

      if (curriculum.idCurriculum && curriculum.idCurriculum != "0") {
        this.skillsService.getSkills(curriculum.idCurriculum).subscribe((skills) => {
          this.skills = skills.filter((skill: Skill) => Number(Boolean(skill.habilidadUnica)) === 1);
        });
      }

      if(curriculum.idiomas) this.languages = curriculum.idiomas;

      if(curriculum.datosInteres) this.interestingData = curriculum.datosInteres;


    });

  }
}
