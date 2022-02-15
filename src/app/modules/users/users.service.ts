import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Login } from 'src/app/core/models/interfaces/login';
import me from 'src/app/curriculum/mockedData/me.json';

@Injectable({
  providedIn: 'root',
})
export class usersService {
  constructor(private http: HttpClient) {}

  login(user: Login): Observable<any> {
    const usuario = me.find(
      (usuario) =>
        usuario.email === user.email && user.password === usuario.password
    );

    console.log(usuario);
    return of({
      idUsuario: usuario?.idUsuario,
      email: usuario?.email,
      nombre: usuario?.nombre,
      token: usuario?.token,
    });
    //return this.http.post("https://reqres.in/api/login", user);
  }

  signUp(user: Login): Observable<any> {
    return this.http.post('https://reqres.in/api/register', user);
  }

  setToken(token: String) {
    localStorage.set('token', token);
  }

  getToken() {
    return localStorage.get('token');
  }
}
