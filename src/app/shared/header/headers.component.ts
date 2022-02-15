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
  isLogged = false;
  loggedUser: any;
  constructor(private headerService: HeaderService) {}

  async ngOnInit() {
    if (localStorage.getItem('token')) {
      this.isLogged = true;
      //const prueba = JSON.parse(localStorage.getItem('token'))
      /*this.loggedUser = {
        userName: JSON.parse(localStorage.getItem('token')).
      }*/
    }
    this.headerService.currentUrl$.subscribe(
      (url) => (this.loginButtonHidden = url === 'login')
    ); //Oculto el botón de login si la página activa es login.
  }

  onLogoClick() {
    this.headerService.changeUrl('');
  }

  onLogoutClick(){

    //TODO: Crear behavioursubject para escuchar botones del header.
    localStorage.removeItem('token');
  }
}
