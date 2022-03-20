import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { User } from 'src/app/core/models/interfaces/user';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class EducationsService {
  constructor(private http: HttpClient) {}

  getEducations(idCurriculum:string): Observable<any> {

    return this.http.get(environment.apiUrl+'formacion?idCurriculum='+idCurriculum);

  }

  getEducation(idEducation:string): Observable<any> {

    return this.http.get(environment.apiUrl+'formacion?idFormacion='+idEducation);

  }


  createEducation(education:any): Observable<any> {

    return this.http.post(environment.apiUrl+'formacion', education);

  }

  updateEducation(education:any): Observable<any> {

    return this.http.put(environment.apiUrl+'formacion', education);

  }

  deleteEducation(education:any): Observable<any> {
    return this.http.delete(environment.apiUrl+'formacion?idFormacion='+education.idFormacion)

  }


}
