import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Login } from 'src/app/core/models/interfaces/login';
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
  loggedUser: any;
  constructor(private headerService: HeaderService) {}

  async ngOnInit() {
    if (localStorage.getItem('token')) {
      this.isLogged = true;
    }


    this.headerService.currentUrl$.subscribe(
      (url) => {
        this.loginButtonHidden = url === 'login' || this.isLogged==true;
        this.signUpButtonHidden = url === 'usuario' || this.isLogged==true;

        console.log(url)
      }
    ); //Hago a la cabecera estar a la escucha de cambios en la url para poder ocultar o mostrar el botón de login dependiendo de si se está o no en la página.

    this.headerService.currentLogin$.subscribe(islogged => this.isLogged = islogged); //Hago a la cabecera estar a la escucha del login para mostrar botones distintos.
  }

  onLogoClick() {
    this.headerService.changeUrl('');
  }

  onLogoutClick(){

    //TODO: Crear behavioursubject para escuchar botones del header.
    localStorage.removeItem('token');

    this.headerService.changeLoginState(false);
    this.loginButtonHidden = false;
  }
}
