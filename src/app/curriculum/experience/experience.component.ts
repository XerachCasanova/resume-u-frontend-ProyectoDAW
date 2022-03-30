import { Component, OnInit } from '@angular/core';
import { ColorRange } from 'src/app/core/models/interfaces/colorRange';
import { Experience } from 'src/app/core/models/interfaces/experience';
import { ExperiencesService } from 'src/app/modules/private/experiences/experiences.service';
import { environment } from 'src/environments/environment';
import { CurriculumColorsService } from '../curriculum-colors.service';
import { CurriculumService } from '../curriculum.service';

@Component({
  selector: 'curriculum-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss'],
})
export class ExperienceComponent implements OnInit {
  experiences: Experience[] = [];
  gamaColores: ColorRange;
  chargeCompleted = false;
  apiUrl = environment.apiUrl
  constructor(
    private curriculumService: CurriculumService,
    private experiencesService: ExperiencesService,
    private curriculumColorsService: CurriculumColorsService
  ) {}

  ngOnInit(): void {
    this.curriculumService.currentCurriculum$.subscribe(async (curriculum) => {
      //El valor inicial del behaviorSubject es un curriculum sin datos, cuya id es = 0, se debe evitar una petición al back con ese curriculum.
      if (curriculum.idCurriculum && curriculum.idCurriculum != '0') {
        this.gamaColores = this.curriculumColorsService.buildColorRange(
          curriculum.gamaColores
        );
        this.experiencesService
          .getExperiences(curriculum.idCurriculum)
          .subscribe((experiences) => {
            this.experiences = experiences.sort(
              (a: Experience, b: Experience) =>
                Number(new Date(b.fechaComienzo).getTime()) -
                Number(new Date(a.fechaComienzo).getTime())
            );
          });
        this.chargeCompleted = true;
      }
    });
  }
}
