import { Injectable } from '@angular/core';
import curriculumsJson from './mockedData/curriculum.json';

export interface Curriculum {
  idCurriculum?: number,
  alias: string,
  acercaDe: string,
  profesion: string,
  gamaColores: number,
  habilidadUnica: []
  idiomas: [],
  datosInteres: [],
  web?: string | null,
}

@Injectable({
  providedIn: 'root'
})
export class CurriculumService {

  constructor() { }

  getCurriculum(alias: string): any{

    const curriculums = curriculumsJson as Curriculum[];
    return curriculums.find((curriculum:Curriculum) => curriculum.alias === alias);


  }
}
