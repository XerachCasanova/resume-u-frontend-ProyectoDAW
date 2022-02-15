import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Curriculum } from '../core/models/interfaces/curriculum';
import curriculumsJson from './mockedData/curriculum.json';

@Injectable({
  providedIn: 'root',
})
export class CurriculumService {
  public curriculum: Curriculum = {
    acercaDe: '',
    alias: '',
    datosInteres: [],
    foto: '',
    gamaColores: 0,
    habilidadesUnicas: [],
    idUsuario: 0,
    idiomas: [],
    profesion: '',
    idCurriculum: 0,
    web: null,
  };
  public subject = new Subject<Curriculum>();

  private curriculumSource = new BehaviorSubject(this.curriculum);
  currentCurriculum$ = this.curriculumSource.asObservable();

  constructor() {}

  changeCurriculum(curriculum: Curriculum) {
    this.curriculumSource.next(curriculum);
  }

  async getCurriculum(alias: string): Promise<any> {
    const curriculums = curriculumsJson as Curriculum[];
    return curriculums.find(
      (curriculum: Curriculum) => curriculum.alias === alias
    );
  }
}
