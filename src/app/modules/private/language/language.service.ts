import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { User } from 'src/app/core/models/interfaces/user';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  constructor(private http: HttpClient) {}

  getLanguages(): Observable<any> {

    return this.http.get(environment.apiUrl+'idioma')

  }


  createLanguage(language:any): Observable<any> {

    return this.http.post(environment.apiUrl+'idioma', language)

  }

  createLanguageCurriculum(language:any): Observable<any> {

    return this.http.post(environment.apiUrl+'idioma?idCurriculum='+language.idCurriculum, language)

  }

  updateLanguage(language:any): Observable<any> {

    return this.http.put(environment.apiUrl+'idioma', language)

  }

  deleteLanguage(language:any): Observable<any> {

    return this.http.delete(environment.apiUrl+'idioma?idIdioma='+language.idIdioma);

  }

  deleteLanguageCurriculum(language:any): Observable<any> {

    return this.http.delete(environment.apiUrl+'idioma?idRelIdiomaCurriculum='+language.idRelIdiomaCurriculum)

  }




}
