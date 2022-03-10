import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { User } from 'src/app/core/models/interfaces/user';


@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {

    return this.http.get('http://localhost/curriculum-api/usuario')

  }

  getUser(idUsuario:string): Observable<any> {

    return this.http.get('http://localhost/curriculum-api/usuario?id=' + idUsuario)

  }

  createUser(user:User): Observable<any> {

    return this.http.post('http://localhost/curriculum-api/usuario', user)

  }

  updateUser(user:User): Observable<any> {

    return this.http.put('http://localhost/curriculum-api/usuario', user)

  }


  checkDni(dni:string): Observable<any> {

    return this.http.get('http://localhost/curriculum-api/usuario?dni='+ dni);

  }

  checkEmail(email:string): Observable<any> {

    return this.http.get('http://localhost/curriculum-api/usuario?email='+ email);

  }

  activateUser(activationCode:string, idUsuario:string): Observable<any> {

    return this.http.get('http://localhost/curriculum-api/usuario?activationCode='+ activationCode + '&id='+idUsuario);

  }


}
