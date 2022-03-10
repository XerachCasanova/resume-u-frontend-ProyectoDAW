import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
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
    idUsuario: '',
    idiomas: [],
    profesion: '',
    idCurriculum: '',
    web: null,
  };
  public subject = new Subject<Curriculum>();

  private curriculumSource = new BehaviorSubject(this.curriculum);
  currentCurriculum$ = this.curriculumSource.asObservable();

  constructor(private http:HttpClient) {}

  changeCurriculum(curriculum: Curriculum) {
    this.curriculumSource.next(curriculum);
  }


  getCurriculums(idUsuario: string): Observable<any> {

    return this.http.get('http://localhost/curriculum-api/curriculum?idUsuario='+idUsuario);

  }

  createCurriculum(curriculum: Curriculum): Observable<any> {

    return this.http.post('http://localhost/curriculum-api/curriculum', curriculum);

  }

  updateCurriculum(curriculum: any): Observable<any> {

    return this.http.put('http://localhost/curriculum-api/curriculum', curriculum);

  }


  async getCurriculum(alias: string): Promise<any> {
    const curriculums = curriculumsJson as Curriculum[];
    return curriculums.find(
      (curriculum: Curriculum) => curriculum.alias === alias
    );
  }
}
