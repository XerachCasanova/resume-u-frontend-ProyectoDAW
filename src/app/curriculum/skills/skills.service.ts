import { Injectable } from '@angular/core';
import { Skill } from '../../core/models/interfaces/skills';
import skillsJson from '../mockedData/habilidades.json';

@Injectable({
  providedIn: 'root',
})
export class SkillsService {
  constructor() {}

  async getSkills(idCurriculum?: number): Promise<any> {
    const skills = skillsJson;
    return skills.find((skill: any) => skill.idCurriculum === idCurriculum)
      ?.habilidades;
  }
}
