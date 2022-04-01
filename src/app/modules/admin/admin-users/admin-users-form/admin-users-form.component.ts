import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CurriculumService } from 'src/app/curriculum/curriculum.service';
import { TokenService } from 'src/app/modules/login/token.service';
import { HeaderService } from 'src/app/shared/header/header.service';

import { MAX_LENGTH } from 'src/app/core/enums/max-length.enum';
import { UsersFormModalService } from 'src/app/modules/users/modals/users-form-modal.service';
import { UsersService } from 'src/app/modules/users/users.service';
import { provinciasService } from 'src/app/modules/users/provincias.service';
import { Curriculum } from 'src/app/core/models/interfaces/curriculum';
import { Provincia } from 'src/app/core/models/interfaces/provincia';
import { User } from 'src/app/core/models/interfaces/user';

@Component({
  selector: 'private-admin-users-form',
  templateUrl: './admin-users-form.component.html',
  styleUrls: ['./admin-users-form.component.scss'],
})
export class AdminUsersFormComponent {
  @ViewChild('passwordCurriculum') passwordCurriculum: ElementRef;
  formUserGroup: FormGroup;
  user: User;
  idUsuario: string;
  errorMsg: string;
  provinces: Provincia[];
  selectedProvince: Provincia | undefined;
  spinnerOn = false;
  chargeForm = false;
  curriculum: Curriculum;
  roles: any;
  isPrivate: boolean;
  lengthForm: any;
  isAdding = false;
  titleForm = 'Modificar usuario';

  constructor(
    private fb: FormBuilder,
    private headerService: HeaderService,
    private activatedRoute: ActivatedRoute,
    private routeParams: ActivatedRoute,
    private usersService: UsersService,
    private provinciasService: provinciasService,
    private usersFormModalService: UsersFormModalService,
    private router: Router
  ) {}

  ngOnInit() {
    this.lengthForm = {
      nombre: MAX_LENGTH.LENGTH_50,
      apellidos: MAX_LENGTH.LENGTH_100,
      direccion: MAX_LENGTH.LENGTH_200,
      localidad: MAX_LENGTH.LENGTH_100,
      cp: MAX_LENGTH.LENGTH_5,
      acercaDe: MAX_LENGTH.LENGTH_500,
      telefonos: MAX_LENGTH.LENGTH_15,
      facebook: MAX_LENGTH.LENGTH_150,
      linkedin: MAX_LENGTH.LENGTH_150,
      instagram: MAX_LENGTH.LENGTH_150,
    };

    this.resetUser();
    this.formUserGroup = this.fb.group({});
    this.setValidators();

    /*A través del servicio activatedRoute, llamo al servicio headerService, el cual está a la escucha del segmento de url que se le pasa como string.
    Eso hará que desde la cabecera podamos suscribirnos a dicho servicio y saber en que url estamos en cada momento.*/

    this.activatedRoute.url.subscribe((urlSegment) =>
      this.headerService.changeUrl(urlSegment[0].path)
    );

    this.routeParams.queryParams.subscribe((params) => {
      if (params.idUsuario) {
        this.idUsuario = params.idUsuario;
      }

      if (this.idUsuario && this.idUsuario != '') {
        this.usersService.getUser(this.idUsuario).subscribe((user) => {
          this.isAdding = false;

          this.user = user[0];
          this.resetForm();
          this.chargeProvinces();
          this.chargeRoles();
          this.setValidators();
        });
      } else {
        this.isAdding = true;
        this.resetForm();
        this.setValidators();
        this.chargeProvinces();
        this.chargeRoles();
        this.isAdding = true;
        this.titleForm = 'Añadir usuario';
      }
    });
  }

  setValidators() {

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

    this.formUserGroup.get('direccion')?.setValidators([
      //Validators.required,
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
      .get('twitter')
      ?.setValidators(Validators.pattern('^@[A-Za-z0-9_]{1,15}$'));

    this.formUserGroup
      .get('telefono1')
      ?.setValidators([
        Validators.pattern('^[0-9]*$'),
        Validators.maxLength(this.lengthForm.telefonos),
      ]);
    this.formUserGroup
      .get('telefono2')
      ?.setValidators([
        Validators.pattern('^[0-9]*$'),
        Validators.maxLength(this.lengthForm.telefonos),
      ]);
    this.formUserGroup
      .get('facebook')
      ?.setValidators([Validators.maxLength(this.lengthForm.facebook)]);
    this.formUserGroup
      .get('linkedin')
      ?.setValidators([Validators.maxLength(this.lengthForm.linkedin)]);
    this.formUserGroup
      .get('instagram')
      ?.setValidators([Validators.maxLength(this.lengthForm.instagram)]);
    this.formUserGroup
      .get('acercaDe')
      ?.setValidators([Validators.maxLength(this.lengthForm.acercaDe)]);
    this.formUserGroup
      .get('email')
      ?.setValidators([
        Validators.required,
        Validators.pattern(
          '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'
        ),
        Validators.maxLength(this.lengthForm.email),
      ]);

    if (this.isAdding) {
      this.formUserGroup
        .get('password')
        ?.setValidators([
          Validators.required,
          Validators.maxLength(this.lengthForm.password),
        ]);
    }
  }

  chargeProvinces() {
    this.provinciasService.getProvincias().subscribe((provinces) => {
      this.provinces = provinces;
      this.onCpPressKey(this.user.cp);
      this.chargeForm = true;
    });
  }

  chargeRoles() {
    this.usersService.getRoles().subscribe((roles) => {
      this.roles = roles;
    });
  }


  resetUser() {
    this.user = {
      nombre: '',
      apellidos: '',
      dni: '',
      fechaNacimiento: '',
      acercaDe: '',
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
      activo: '',
      idRol: '3',
    };
  }

  onCpPressKey($event: any | string) {
    this.selectedProvince = this.provinces.find(
      (province) =>
        province.prefijoCp ==
        ($event.target ? $event.target.value.slice(0, 2) : $event.slice(0, 2))
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
              ' El DNI introducido pertenece a un usuario ya existente.'
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
              ' El E-mail introducido pertenece a un usuario ya existente.'
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

  onPersonalDataSubmit() {
    this.spinnerOn = true;
    this.user = {
      ...this.formUserGroup.value,
      provincia: this.selectedProvince?.idProvincia,
    };

    if(this.isAdding){
      this.usersService.createUser(this.user).subscribe(
        (resp) => {
          if (resp.status && resp.status === 'ok') {
            const modalForm = this.usersFormModalService.openModal(
              true,
              'Usuario creado correctamente.'
            )

            modalForm.afterClosed().subscribe(() =>  this.router.navigate(['admin', 'admin-users']));
          }
          this.spinnerOn = false;
        },
        (error) => {

          this.usersFormModalService.openModal(
            false,
            'Ha ocurrido un error inesperado, por favor, vuelve a intentarlo más tarde.'
          );
          this.spinnerOn = false;
        }
      );

    } else {
      this.usersService.updateUser(this.user).subscribe(
        (resp) => {
          if (resp.status && resp.status === 'ok') {
            this.usersFormModalService.openModal(
              true,
              'Datos de usuario modificados correctamente.'
            ).afterClosed().subscribe(() => this.router.navigate(['admin', 'admin-users']));
          }
          this.spinnerOn = false;
        },
        (error) => {
          this.usersFormModalService.openModal(
            false,
            'Ha ocurrido un error inesperado, por favor, vuelve a intentarlo más tarde.'
          );
          this.spinnerOn = false;
        }
      );
    }

  }
  resetForm() {
    this.formUserGroup = this.fb.group({
      ...this.user,
      provincia: '',
      activo: Boolean(Number(this.user.activo)),
      password: '',
    });

    this.setValidators();
  }
}
