import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { User } from 'src/app/core/models/interfaces/user';


@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  constructor(private http: HttpClient) {}

  getLanguages(): Observable<any> {

    return this.http.get('http://localhost/curriculum-api/idioma')

  }


  createLanguage(language:any): Observable<any> {

    return this.http.post('http://localhost/curriculum-api/idioma', language)

  }

  createLanguageCurriculum(language:any): Observable<any> {

    return this.http.post('http://localhost/curriculum-api/idioma?idCurriculum='+language.idCurriculum, language)

  }

  updateLanguage(language:any): Observable<any> {

    return this.http.put('http://localhost/curriculum-api/idioma', language)

  }

  deleteLanguage(language:any): Observable<any> {

    return this.http.delete('http://localhost/curriculum-api/idioma', language)

  }

  deleteLanguageCurriculum(language:any): Observable<any> {

    return this.http.delete('http://localhost/curriculum-api/idioma?idRelIdiomaCurriculum='+language.idRelIdiomaCurriculum, language)

  }




}
