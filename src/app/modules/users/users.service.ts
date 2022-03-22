import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { User } from 'src/app/core/models/interfaces/user';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {

    return this.http.get(environment.apiUrl+'usuario')

  }

  getUser(idUsuario:string): Observable<any> {

    return this.http.get(environment.apiUrl+'usuario?id=' + idUsuario)

  }

  createUser(user:User): Observable<any> {

    return this.http.post(environment.apiUrl+'usuario', user)

  }

  generateActivationCode(user:User): Observable<any> {

    return this.http.put(environment.apiUrl+'usuario?activarUsuario='+user.idUsuario, user)

  }

  updateUser(user:User): Observable<any> {

    return this.http.put(environment.apiUrl+'usuario', user)

  }


  checkDni(dni:string): Observable<any> {

    return this.http.get(environment.apiUrl+'usuario?dni='+ dni);

  }

  checkEmail(email:string): Observable<any> {

    return this.http.get(environment.apiUrl+'usuario?email='+ email);

  }

  activateUser(activationCode:string, idUsuario:string): Observable<any> {

    return this.http.get(environment.apiUrl+'usuario?activationCode='+ activationCode + '&id='+idUsuario);

  }


}
