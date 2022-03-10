import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Login } from 'src/app/core/models/interfaces/login';
import { User } from 'src/app/core/models/interfaces/user';
import me from 'src/app/curriculum/mockedData/me.json';

@Injectable({
  providedIn: 'root',
})
export class provinciasService {
  constructor(private http: HttpClient) {}

  getProvincias(): Observable<any> {

    return this.http.get('http://localhost/curriculum-api/provincia');

  }

  getProvincia(cp:string): Observable<any> {

    return this.http.get('http://localhost/curriculum-api/provincia?cp=' + cp);

  }


}
