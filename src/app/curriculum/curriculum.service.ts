import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Curriculum } from '../core/models/interfaces/curriculum';

@Injectable({
  providedIn: 'root',
})
export class CurriculumService {
  public curriculum: Curriculum = {
    esPrivado: false,
    tipoHabilidades: '',
    acercaDe: '',
    alias: '',
    datosInteres: [],
    foto: '',
    gamaColores: '',
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

    return this.http.get(environment.apiUrl+'curriculum?idUsuario='+idUsuario);

  }

  getCurriculumByAlias(alias: string): Observable<any> {

    return this.http.get(environment.apiUrl+'curriculum?alias='+alias);

  }

  checkAlias(alias: string, idCurriculum: string): Observable<any> {

    return this.http.get(environment.apiUrl+'curriculum?alias='+alias+'&idCurriculum='+idCurriculum);

  }



  createCurriculum(curriculum: Curriculum): Observable<any> {

    return this.http.post(environment.apiUrl+'curriculum', curriculum);

  }

  updateCurriculum(curriculum: any): Observable<any> {

    return this.http.put(environment.apiUrl+'curriculum', curriculum);

  }



}
