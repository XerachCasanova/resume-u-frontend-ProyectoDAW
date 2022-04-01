import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Login } from 'src/app/core/models/interfaces/login';
import { User } from 'src/app/core/models/interfaces/user';
import { environment } from 'src/environments/environment';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  login(user: Login): Observable<any> {
    return this.http.post(environment.apiUrl + 'auth', user);
  }

  isAdmin(): Observable<any> {
    const idUsuario = this.tokenService.getUser().idUsuario;
    return this.http.get(environment.apiUrl + 'auth?isAdmin=' + idUsuario);
  }

  isUser(): Observable<any> {
    const idUsuario = this.tokenService.getUser().idUsuario;
    return this.http.get(environment.apiUrl + 'auth?isUser=' + idUsuario);
  }

  

  refreshToken(token: string) {
    const refreshtoken = {
      refreshToken: token,
    };
    return this.http.post(
      environment.apiUrl + 'auth/refreshtoken',
      refreshtoken,
      this.httpOptions
    );
  }

  /*signUp(user: Login): Observable<any> {
    return this.http.post('https://reqres.in/api/register', user);
  }*/
}
