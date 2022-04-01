import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Login } from 'src/app/core/models/interfaces/login';
import { LoginService } from 'src/app/modules/login/login.service';
import { TokenService } from 'src/app/modules/login/token.service';
import { HeaderService } from './header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeadersComponent implements OnInit {
  loginButtonHidden = false;
  signUpButtonHidden = false;
  isLogged = false;
  isAdmin = false;
  loggedUser: any;
  constructor(
    private headerService: HeaderService,
    private tokenService: TokenService,
    private loginService: LoginService,
  ) {}

  async ngOnInit() {
    //SE LLAMA AL ENDPOINT CHECKTOKEN, un endpoint que solo devuelve 200 si es correcto o 401 si el token no es válido.
    if (localStorage.getItem('auth-token')) {
      this.tokenService.checkToken().subscribe(
        () => {
          this.headerService.changeLoginState(true);

          this.loginService.isAdmin().subscribe(isAdmin =>  this.isAdmin = isAdmin);
        },
        () => {

          this.tokenService.signOut();
        }
      );

    }

    this.headerService.currentUrl$.subscribe((url) => {
      this.loginButtonHidden = url === 'login' || this.isLogged == true;
      this.signUpButtonHidden = url === 'usuario' || this.isLogged == true;

    }); //Hago a la cabecera estar a la escucha de cambios en la url para poder ocultar o mostrar el botón de login dependiendo de si se está o no en la página.

    this.headerService.currentLogin$.subscribe(
      (islogged) => (this.isLogged = islogged)
    ); //Hago a la cabecera estar a la escucha del login para mostrar botones distintos.

    this.headerService.currentAdmin$.subscribe((isAdmin) => this.isAdmin = isAdmin);
  }

  onLogoClick() {
    this.headerService.changeUrl('');
  }

  onLogoutClick() {
    //TODO: Crear behavioursubject para escuchar botones del header.
    this.tokenService.signOut();

    this.headerService.changeLoginState(false);
    this.loginButtonHidden = false;
  }
}
