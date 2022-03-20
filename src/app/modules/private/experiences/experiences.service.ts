import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class ExperiencesService {
  constructor(private http: HttpClient) {}

  getExperiences(idCurriculum:string): Observable<any> {

    return this.http.get(environment.apiUrl+'experiencia?idCurriculum='+idCurriculum);

  }

  getExperience(idExperience:string): Observable<any> {

    return this.http.get(environment.apiUrl+'experiencia?idExperiencia='+idExperience);

  }



  createExperience(experience:any): Observable<any> {

    return this.http.post(environment.apiUrl+'experiencia', experience);

  }

  updateExperience(experience:any): Observable<any> {

    return this.http.put(environment.apiUrl+'experiencia', experience);

  }

  deleteExperience(experience:any): Observable<any> {
    return this.http.delete(environment.apiUrl+'experiencia?idExperiencia='+experience.idExperiencia)

  }


}
