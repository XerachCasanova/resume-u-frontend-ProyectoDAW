import { Component, OnInit } from '@angular/core';
import { Experience } from 'src/app/core/models/interfaces/experience';
import { environment } from 'src/environments/environment';
import { CurriculumService } from '../curriculum.service';
import { ExperienceService } from './experience.service';

@Component({
  selector: 'curriculum-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.css']
})
export class ExperienceComponent implements OnInit {

  experience: Experience[];
  constructor(private curriculumService:CurriculumService, private experienceService: ExperienceService) {


    this.curriculumService.currentCurriculum$.subscribe(async curriculum => {
      //El valor inicial del behaviorSubject es un curriculum sin datos, cuya id es = 0, se debe evitar una petición al back con ese curriculum.
      if(curriculum.idCurriculum != 0){
        this.experience = await this.experienceService.getExperience(curriculum.idCurriculum);
        console.log(this.experience)
      }
    })



   }

  ngOnInit(): void {
  }

}
