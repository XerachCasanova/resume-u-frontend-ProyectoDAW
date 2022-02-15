import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Login } from 'src/app/core/models/interfaces/login';
import { Usuario } from 'src/app/core/models/interfaces/usuario';
import { HeaderService } from 'src/app/shared/header/header.service';
import { usersService } from '../users/users.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  formLoginGroup: FormGroup;
  usuario!: Usuario;
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

    this.formLoginGroup = this.fb.group(this.usuario);
    this.formLoginGroup.get('email')?.setValidators(Validators.required);
    this.formLoginGroup.get('password')?.setValidators(Validators.required);
  }

  resetLogin() {
    this.usuario = {
      nombre: '',
      apellidos: '',
      dni: '',
      fechaNacimiento: '',
      direccion: '',
      localidad: '',
      provincia: '',
      cp:'',
      telefono1: '',
      telefono2: '',
      email: '',
      password: '',
    };
  }

  onSubmit() {
    
  }
}
