import { Injectable } from '@angular/core';
import { Experience } from '../../core/models/interfaces/experience';
import educationJson from '../mockedData/formacion.json';

@Injectable({
  providedIn: 'root',
})
export class EducationService {
  constructor() {}

  async getEducation(idCurriculum?: string): Promise<any> {
    const educations = educationJson;
    return educations.find(
      (experience: any) => experience.idCurriculum === idCurriculum
    )?.formacion;
  }
}
