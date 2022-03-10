import { Injectable } from '@angular/core';
import { Experience } from '../../core/models/interfaces/experience';
import experienceJson from '../mockedData/experiencia.json';

@Injectable({
  providedIn: 'root',
})
export class ExperienceService {
  constructor() {}

  async getExperience(idCurriculum?: string): Promise<any> {
    const experiences = experienceJson;
    return experiences.find(
      (experience: any) => experience.idCurriculum === idCurriculum
    )?.experiencia;
  }
}
