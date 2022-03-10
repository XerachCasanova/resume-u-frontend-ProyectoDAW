import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Login } from 'src/app/core/models/interfaces/login';
import { HeaderService } from 'src/app/shared/header/header.service';
import { LoginService } from './login.service';
import { TokenService } from './token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  formLoginGroup: FormGroup;
  login!: Login;
  errorMsg: string;
  spinnerOn=false;
  constructor(
    private fb: FormBuilder,
    private router:Router,
    private headerService: HeaderService,
    private activatedRoute: ActivatedRoute,
    private loginService: LoginService,
    private tokenService: TokenService
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

    this.formLoginGroup = this.fb.group(this.login);
  }

  onSubmit() {
    this.spinnerOn=true;
    this.login = this.formLoginGroup.value;
    this.loginService.login(this.login).subscribe(
      (user) => {

        this.tokenService.saveToken(user.token);
        this.tokenService.saveUser(user);

        this.headerService.changeLoginState(true);
        this.spinnerOn=false;
        this.router.navigate(['']);
      },
      (error) =>
        {
          this.spinnerOn=false;
          this.tokenService.signOut();
          this.resetLogin();
          this.errorMsg =
          error.status === 400
            ? "Usuario o contraseña incorrectos."
            : 'Ha ocurrido un error, vuelve a intentarlo más tarde.'
          }
    );
  }
}
