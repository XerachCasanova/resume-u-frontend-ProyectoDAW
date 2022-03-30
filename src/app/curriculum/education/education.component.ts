import { Component, OnInit } from '@angular/core';
import { ColorRange } from 'src/app/core/models/interfaces/colorRange';
import { Education } from 'src/app/core/models/interfaces/education';
import { Experience } from 'src/app/core/models/interfaces/experience';
import { EducationsService } from 'src/app/modules/private/educations/educations.service';
import { CurriculumColorsService } from '../curriculum-colors.service';
import { CurriculumService } from '../curriculum.service';

@Component({
  selector: 'curriculum-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss'],
})
export class EducationComponent implements OnInit {
  educationsOfficial: Education[] = [];
  educationsUnofficial: Education[] = [];
  gamaColores: ColorRange;
  chargeCompleted = false;
  constructor(
    private curriculumService: CurriculumService,
    private educationsService: EducationsService,
    private curriculumColorsService: CurriculumColorsService
  ) {
    this.curriculumService.currentCurriculum$.subscribe(async (curriculum) => {
      //El valor inicial del behaviorSubject es un curriculum sin datos, cuya id es = 0, se debe evitar una petición al back con ese curriculum.
      if (curriculum.idCurriculum && curriculum.idCurriculum != '0') {
        this.gamaColores = this.curriculumColorsService.buildColorRange(
          curriculum.gamaColores
        );
        this.educationsService
          .getEducations(curriculum.idCurriculum)
          .subscribe((educations) => {
            this.educationsOfficial = educations
              .sort(
                (a: Education, b: Education) =>
                  Number(new Date(b.fechaComienzo).getTime()) -
                  Number(new Date(a.fechaComienzo).getTime())
              )
              .filter((education: Education) =>
                Boolean(Number(education.esTitulacionOficial))
              )
            this.educationsUnofficial = educations
              .sort(
                (a: Education, b: Education) =>
                  Number(new Date(b.fechaComienzo).getTime()) -
                  Number(new Date(a.fechaComienzo).getTime())
              )
              .filter(
                (education: Education) =>
                  !Boolean(Number(education.esTitulacionOficial))
              )
            this.chargeCompleted = true;
          });
      }
    });
  }

  ngOnInit(): void {}
}
