import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Login } from 'src/app/core/models/interfaces/login';
import me from 'src/app/curriculum/mockedData/me.json';

const TOKEN_KEY = 'auth-token';
const REFRESHTOKEN_KEY = 'auth-refreshtoken';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root',
})
export class TokenService {

  constructor(private http:HttpClient) {}

  signOut(){ //Cierra sesión
    localStorage.clear();
  }

  saveToken(token:string){ //elimina el token existente y guarda el que recibe por parámetro
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, token);

    if(this.getUser()) this.saveUser({...this.getUser(), accessToken: token}); //Añade el token al usuario.
  }

  checkToken(){

    return this.http.get('http://localhost/curriculum-api/checkToken');
  }

  /*public saveRefreshToken(token: string): void { //Elimina el refreshtoken existente y añade el nuevo token que se pasa por parámetro.

    console.log(token)
    localStorage.removeItem(REFRESHTOKEN_KEY);
    localStorage.setItem(REFRESHTOKEN_KEY, token);
  }

  public getRefreshToken(): string | null { //Devuelve el refrestoken o un nulo si no hay token.
    return localStorage.getItem(REFRESHTOKEN_KEY);
  }*/

  getToken(): string | null { //Devuelve el token o un nulo si no hay token.
    return localStorage.getItem(TOKEN_KEY);
  }

  saveUser(user: any): any { //Elimina el usuario existente en el localstorage y añade el que se pasa por parámetro
    localStorage.removeItem(USER_KEY);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  getUser(): any{ //Recoge el usuario del localstorage y lo devuelve como objeto.
    const user = localStorage.getItem(USER_KEY);
    if(user) return JSON.parse(user);

    return {};
  }
}
