import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { User } from 'src/app/core/models/interfaces/user';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class InterestingDataService {
  constructor(private http: HttpClient) {}

  getInterestingData(idCurriculum:string): Observable<any> {

    return this.http.get(environment.apiUrl+'datointeres?idCurriculum='+idCurriculum)

  }


  createInterestingData(interestingData:any): Observable<any> {

    return this.http.post(environment.apiUrl+'datointeres', interestingData)

  }


  deleteInterestingData(interestingData:any): Observable<any> {
    return this.http.delete(environment.apiUrl+'datointeres?idDatoInteres='+interestingData.idDatoInteres)

  }


}
