import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Login } from 'src/app/core/models/interfaces/login';
import me from 'src/app/curriculum/mockedData/me.json';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  constructor(private http: HttpClient) {}

  login(user: Login): Observable<any> {

    return this.http.post('http://localhost/curriculum-api/auth', user);

  }


  refreshToken(token: string){

    const refreshtoken = {
      refreshToken: token
    }
    return this.http.post('http://localhost/curriculum-api/auth/refreshtoken',refreshtoken, this.httpOptions);
  }

  signUp(user: Login): Observable<any> {
    return this.http.post('https://reqres.in/api/register', user);
  }


}
