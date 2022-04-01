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
    return this.http.get(environment.apiUrl + 'usuario');
  }

  getUser(idUsuario: string): Observable<any> {
    return this.http.get(environment.apiUrl + 'usuario?id=' + idUsuario);
  }

  createUser(user: User): Observable<any> {
    return this.http.post(environment.apiUrl + 'usuario', user);
  }

  generateActivationCode(user: User): Observable<any> {
    return this.http.put(
      environment.apiUrl + 'usuario?activarUsuario=' + user.idUsuario,
      user
    );
  }

  recoverPasswordSendEmail(email:string){

      return this.http.put(environment.apiUrl + 'usuario?forgotten-password=' + email, email);

  }

  resetPassword(passwordForm:any){

    return this.http.put(environment.apiUrl + 'usuario?reset-password=1&code='+passwordForm.code, passwordForm);

}

  updateUser(user: User): Observable<any> {
    return this.http.put(environment.apiUrl + 'usuario', user);
  }

  deleteUser(user: User): Observable<any> {
    return this.http.delete(
      environment.apiUrl + 'usuario?idUsuario=' + user.idUsuario,
    );
  }

  getRoles(): Observable<any> {
    return this.http.get(environment.apiUrl + 'rol');
  }

  getRol(user: User): Observable<any> {
    return this.http.get(
      environment.apiUrl + 'rol?idUsuario=' + user.idUsuario
    );
  }

  checkDni(dni: string): Observable<any> {
    return this.http.get(environment.apiUrl + 'usuario?dni=' + dni);
  }

  checkEmail(email: string): Observable<any> {
    return this.http.get(environment.apiUrl + 'usuario?email=' + email);
  }

  activateUser(activationCode: string, idUsuario: string): Observable<any> {
    return this.http.get(
      environment.apiUrl +
        'usuario?activationCode=' +
        activationCode +
        '&id=' +
        idUsuario
    );
  }

  checkRecoveryCode(code: string, email: string): Observable<any> {
    return this.http.get(
      environment.apiUrl +
        'usuario?recoveryCode=' +
        code +
        '&recoveryEmail=' +
        email
    );
  }
}
