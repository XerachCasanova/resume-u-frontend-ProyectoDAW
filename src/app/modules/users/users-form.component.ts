import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MAX_LENGTH } from 'src/app/core/enums/max-length.enum';
import { Provincia } from 'src/app/core/models/interfaces/provincia';
import { User } from 'src/app/core/models/interfaces/user';
import { HeaderService } from 'src/app/shared/header/header.service';
import { UsersService } from '../users/users.service';
import { UsersFormModalService } from './modals/users-form-modal.service';
import { provinciasService } from './provincias.service';

@Component({
  selector: 'app-users-form',
  templateUrl: './users-form.component.html',
  styleUrls: ['./users-form.component.scss'],
})
export class UsersFormComponent {
  lengthForm: any;
  formUserGroup: FormGroup;
  usuario!: User;
  errorMsg: string;
  provinces: Provincia[] = [];
  selectedProvince: Provincia | undefined;
  spinnerOn = false;
  constructor(
    private fb: FormBuilder,
    private headerService: HeaderService,
    private activatedRoute: ActivatedRoute,
    private usersService: UsersService,
    private provinciasService: provinciasService,
    private usersFormModalService: UsersFormModalService,
    private router: Router
  ) {
    this.formUserGroup = fb.group({});
    this.resetUser();
  }

  ngOnInit() {
    /*A través del servicio activatedRoute, llamo al servicio headerService, el cual está a la escucha del segmento de url que se le pasa como string.
    Eso hará que desde la cabecera podamos suscribirnos a dicho servicio y saber en que url estamos en cada momento.*/

    this.lengthForm = {
      nombre: MAX_LENGTH.LENGTH_50,
      apellidos: MAX_LENGTH.LENGTH_100,
      direccion: MAX_LENGTH.LENGTH_200,
      localidad: MAX_LENGTH.LENGTH_100,
      cp: MAX_LENGTH.LENGTH_5,
      email: MAX_LENGTH.LENGTH_100,
      telefonos: MAX_LENGTH.LENGTH_15,
      facebook: MAX_LENGTH.LENGTH_150,
      linkedin: MAX_LENGTH.LENGTH_150,
      instagram: MAX_LENGTH.LENGTH_150,
      password: MAX_LENGTH.LENGTH_50,
    };
    this.activatedRoute.url.subscribe((urlSegment) =>
      this.headerService.changeUrl(urlSegment[0].path)
    );

    this.provinciasService.getProvincias().subscribe((provinces) => {
      this.provinces = provinces;
    });

    this.formUserGroup = this.fb.group(this.usuario);
    this.setValidators();
  }

  resetUser() {
    this.usuario = {
      nombre: '',
      apellidos: '',
      dni: '',
      fechaNacimiento: '',
      direccion: '',
      localidad: '',
      provincia: '',
      cp: '',
      telefono1: '',
      telefono2: '',
      email: '',
      password: '',
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
      activo: '0',
      idRol: '3',
    };
  }

  setValidators() {
    this.formUserGroup.addControl(
      'repeatPassword',
      this.fb.control('', Validators.required)
    );

    this.formUserGroup.get('repeatPassword')?.setValue('');

    this.formUserGroup
      .get('nombre')
      ?.setValidators([
        Validators.required,
        Validators.maxLength(this.lengthForm.nombre),
      ]);
    this.formUserGroup
      .get('apellidos')
      ?.setValidators([
        Validators.required,
        Validators.maxLength(this.lengthForm.apellidos),
      ]);

    this.formUserGroup
      .get('direccion')
      ?.setValidators([

        Validators.maxLength(this.lengthForm.direccion),
      ]);
    this.formUserGroup
      .get('cp')
      ?.setValidators([

        Validators.maxLength(this.lengthForm.cp),
        Validators.minLength(this.lengthForm.cp),
      ]);
    this.formUserGroup
      .get('localidad')
      ?.setValidators([

        Validators.maxLength(this.lengthForm.localidad),
      ]);
    this.formUserGroup
      .get('telefono1')
      ?.setValidators([Validators.pattern('^[0-9]*$'), Validators.maxLength(this.lengthForm.telefonos)]);
    this.formUserGroup
      .get('telefono2')
      ?.setValidators([Validators.pattern('^[0-9]*$'), Validators.maxLength(this.lengthForm.telefonos)]);
    this.formUserGroup
      .get('email')
      ?.setValidators([
        Validators.required,
        Validators.email,
        Validators.maxLength(this.lengthForm.email),
      ]);
    this.formUserGroup
      .get('password')
      ?.setValidators([
        Validators.required,
        Validators.maxLength(this.lengthForm.password),
      ]);
    this.formUserGroup
      .get('twitter')
      ?.setValidators(Validators.pattern('^@[A-Za-z0-9_]{1,15}$'));
    this.formUserGroup
      .get('linkedin')
      ?.setValidators([Validators.maxLength(this.lengthForm.linkedin)]);
    this.formUserGroup
      .get('facebook')
      ?.setValidators([Validators.maxLength(this.lengthForm.facebook)]);
    this.formUserGroup
      .get('instagram')
      ?.setValidators([Validators.maxLength(this.lengthForm.instagram)]);
  }

  onCpPressKey($event: any) {
    this.selectedProvince = this.provinces.find(
      (province) => province.prefijoCp == $event.target.value.slice(0, 2)
    );

    this.formUserGroup
      .get('provincia')
      ?.setValue(this.selectedProvince ? this.selectedProvince.provincia : '');
  }

  onCheckableInputChange($event: any, valueToCheck: string) {
    if ($event.target.value != '') {
      if (valueToCheck === 'dni') {
        this.usersService.checkDni($event.target.value).subscribe((resp) => {
          if (resp) {
            const usersFormModal = this.usersFormModalService.openModal(
              false,
              'El DNI introducido pertenece a un usuario ya existente.'
            );

            usersFormModal
              .afterClosed()
              .subscribe(() =>
                this.formUserGroup.get(valueToCheck)?.setValue('')
              );
          }
        });
      } else if (valueToCheck === 'email') {
        this.usersService.checkEmail($event.target.value).subscribe((resp) => {
          if (resp) {
            const usersFormModal = this.usersFormModalService.openModal(
              false,
              'El E-mail introducido pertenece a un usuario ya existente.'
            );

            usersFormModal
              .afterClosed()
              .subscribe(() =>
                this.formUserGroup.get(valueToCheck)?.setValue('')
              );
          }
        });
      }
    }
  }

  onSubmit() {
    this.spinnerOn = true;
    this.usuario = {
      ...this.formUserGroup.value,
      provincia: this.selectedProvince?.idProvincia,
    };

    this.usuario.email = this.usuario.email.toLowerCase();

    this.usersService.createUser(this.usuario).subscribe(
      (resp) => {
        if (resp.status && resp.status === 'ok') {
          const formUserModal =
            this.usersFormModalService.openActivationCodeModal(
              resp.result.idUsuario,
              'Has sido dado de alta correctamente. Para poder empezar a disfrutar del servicio, debes introducir el código que hemos enviado a tu correo electrónico.',
            );

          formUserModal
            .afterClosed()
            .subscribe(() => this.router.navigate(['login']));
        }
        this.spinnerOn = false;
      },
      () => {

        const userFormModal = this.usersFormModalService.openModal(
          false,
          'Ha ocurrido un error inesperado, por favor, vuelve a intentarlo más tarde.'
        );

        userFormModal.afterClosed().subscribe(() => {
          this.usuario.email = '';
          this.usuario.password = '';
          this.formUserGroup = this.fb.group(this.usuario);
          this.setValidators();
        });

        this.spinnerOn = false;
      }
    );
  }

  resetForm() {
    this.resetUser();
    this.formUserGroup = this.fb.group(this.usuario);
    this.setValidators();
  }
}
