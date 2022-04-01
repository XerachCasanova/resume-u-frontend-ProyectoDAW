import { Injectable } from '@angular/core';

import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { LoginService } from './login.service';



@Injectable()
export class AuthUserGuard implements CanActivate {
    constructor(private loginService: LoginService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>  {

      return this.loginService.isUser().pipe(
        map(resp => {

          if (resp!= null) {

            return true;
          } else {

            this.router.navigate(['login']);
            return false;
          }
        }),
        catchError((err) => {

          this.router.navigate(['login']);
          return of(false);
        })
      );
    }
}
