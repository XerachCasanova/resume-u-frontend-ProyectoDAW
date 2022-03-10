import { Component, OnInit } from '@angular/core';
import { Education } from 'src/app/core/models/interfaces/education';
import { Experience } from 'src/app/core/models/interfaces/experience';
import { CurriculumService } from '../curriculum.service';
import { EducationService } from './education.service';

@Component({
  selector: 'curriculum-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss'],
})
export class EducationComponent implements OnInit {
  education: Education[];
  constructor(
    private curriculumService: CurriculumService,
    private educationService: EducationService
  ) {
    this.curriculumService.currentCurriculum$.subscribe(async (curriculum) => {
      //El valor inicial del behaviorSubject es un curriculum sin datos, cuya id es = 0, se debe evitar una petición al back con ese curriculum.
      if (curriculum.idCurriculum != "0") {
        this.education = await this.educationService.getEducation(
          curriculum.idCurriculum
        );
      }
    });
  }

  ngOnInit(): void {}
}
