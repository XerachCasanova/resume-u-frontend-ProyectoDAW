import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Login } from 'src/app/core/models/interfaces/login';
import { HeaderService } from 'src/app/shared/header/header.service';
import { usersService } from '../users/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  formLoginGroup: FormGroup;
  login!: Login;
  errorMsg: string;
  constructor(
    private fb: FormBuilder,
    private headerService: HeaderService,
    private activatedRoute: ActivatedRoute,
    private usersService: usersService
  ) {
    this.formLoginGroup = fb.group({});
    this.resetLogin();
  }

  ngOnInit() {
    /*A través del servicio activatedRoute, llamo al servicio headerService, el cual está a la escucha del segmento de url que se le pasa como string.
    Eso hará que desde la cabecera podamos suscribirnos a dicho servicio y saber en que url estamos en cada momento.*/
    this.activatedRoute.url.subscribe((urlSegment) =>
      this.headerService.changeUrl(urlSegment[0].path)
    );

    this.formLoginGroup = this.fb.group(this.login);
    this.formLoginGroup.get('email')?.setValidators(Validators.required);
    this.formLoginGroup.get('password')?.setValidators(Validators.required);
  }

  resetLogin() {
    this.login = {
      email: '',
      password: '',
    };
  }

  onSubmit() {
    this.login = this.formLoginGroup.value;
    this.usersService.login(this.login).subscribe(
      (user) => {
        const signedUser = {
          email: user.email,
          nombre: user.nombre,
          idUsuario: user.idUsuario,
          token: user.token,
        };

        localStorage.setItem('token', JSON.stringify(signedUser));
      },
      (error) =>
        (this.errorMsg =
          error.status === 400
            ? 'Usuario o contraseña incorrectos'
            : 'Ha ocurrido un error, vuelve a intentarlo más tarde.')
    );
  }
}
