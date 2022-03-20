import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class provinciasService {
  constructor(private http: HttpClient) {}

  getProvincias(): Observable<any> {

    return this.http.get(environment.apiUrl+'provincia');

  }

  getProvincia(cp:string): Observable<any> {

    return this.http.get(environment.apiUrl+'provincia?cp=' + cp);

  }


}
