import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Login } from 'src/app/core/models/interfaces/login';
import { Provincia } from 'src/app/core/models/interfaces/provincia';
import { User } from 'src/app/core/models/interfaces/user';
import { PostalCodeValidatorDirective } from 'src/app/core/validators/custom.validator.component';

import { HeaderService } from 'src/app/shared/header/header.service';
import { usersService } from '../users/users.service';
import { usersFormModalComponent } from './modals/users-form-modal.component';
import { provinciasService } from './provincias.service';

@Component({
  selector: 'app-users-form',
  templateUrl: './users-form.component.html',
  styleUrls: ['./users-form.component.scss'],
})
export class UsersFormComponent {
  formUserGroup: FormGroup;
  usuario!: User;
  errorMsg: string;
  provinces: Provincia[];
  selectedProvince: Provincia | undefined;
  spinnerOn=false;
  constructor(
    private fb: FormBuilder,
    private headerService: HeaderService,
    private activatedRoute: ActivatedRoute,
    private usersService: usersService,
    private provinciasService: provinciasService,
    private usersFormDialog: MatDialog
  ) {
    this.formUserGroup = fb.group({});
    this.resetUser();
  }

  ngOnInit() {
    /*A través del servicio activatedRoute, llamo al servicio headerService, el cual está a la escucha del segmento de url que se le pasa como string.
    Eso hará que desde la cabecera podamos suscribirnos a dicho servicio y saber en que url estamos en cada momento.*/
    this.activatedRoute.url.subscribe((urlSegment) =>
      this.headerService.changeUrl(urlSegment[0].path)
    );

    this.provinciasService.getProvincias().subscribe((provinces) => {
      this.provinces = provinces;
    });

    this.formUserGroup = this.fb.group(this.usuario);
    this.formUserGroup.get('nombre')?.setValidators(Validators.required);
    this.formUserGroup.get('apellidos')?.setValidators(Validators.required);
    this.formUserGroup
      .get('dni')
      ?.setValidators([
        Validators.required,
        Validators.pattern('^([0-9]{8}[a-zA-Z])|[XYZ][0-9]{7}[A-Z]$'),
        Validators.maxLength(9)
      ]);
    this.formUserGroup
      .get('fechaNacimiento')
      ?.setValidators(Validators.required);
    this.formUserGroup.get('direccion')?.setValidators(Validators.required);
    this.formUserGroup
      .get('cp')
      ?.setValidators([
        Validators.required,
      ]);
    this.formUserGroup.get('localidad')?.setValidators(Validators.required);
    //this.formUserGroup.get('provincia')?.setValidators(Validators.required);
    this.formUserGroup
      .get('email')
      ?.setValidators([
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ]);
    this.formUserGroup.get('password')?.setValidators(Validators.required);
    this.formUserGroup
      .get('twitter')
      ?.setValidators(Validators.pattern('^@[A-Za-z0-9_]{1,15}$'));


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

  onCpPressKey($event: any) {
    this.selectedProvince = this.provinces.find(
      (province) => province.prefijoCp == $event.target.value.slice(0, 2)
    );

    this.formUserGroup
      .get('provincia')
      ?.setValue(this.selectedProvince ? this.selectedProvince.provincia : '');
  }

  onCheckableInputChange($event: any, valueToCheck:string) {
    console.log(this.formUserGroup.get('cp')?.errors)
    if ($event.target.value != '') {
      if(valueToCheck === 'dni') {
        this.usersService.checkDni($event.target.value).subscribe((resp) => {
          if (resp) {
            const usersFormModal = this.usersFormDialog.open(
              usersFormModalComponent,
              this.errorModalInfo(" El DNI introducido pertenece a un usuario ya existente.")
            );

            usersFormModal.afterClosed().subscribe(() => this.formUserGroup.get(valueToCheck)?.setValue(''));
          }
        });
      } else if (valueToCheck === 'email'){
        this.usersService.checkEmail($event.target.value).subscribe((resp) => {
          if (resp) {
            const usersFormModal = this.usersFormDialog.open(
              usersFormModalComponent,
              this.errorModalInfo(" El E-mail introducido pertenece a un usuario ya existente.")
            );

            usersFormModal.afterClosed().subscribe(() => this.formUserGroup.get(valueToCheck)?.setValue(''));
          }
        });
      }
    }
  }

  errorModalInfo(errorMsg: string){

    return  {
      maxWidth: '300px',
      data:
        {
        header: 'error',
        type: 'error',
        errorMsg: errorMsg
        }
    }
  }

  onSubmit() {
    this.spinnerOn=true;
    this.usuario = {
      ...this.formUserGroup.value,
      provincia: this.selectedProvince?.idProvincia,
    };

    this.usersService
      .createUser(this.usuario)
      .subscribe((resp) => {
        console.log(resp);
        if(resp.status && resp.status==='ok'){
          const formUserModal = this.usersFormDialog.open(usersFormModalComponent, {maxWidth: '800px', data: { header:'advise', type: 'activationCode', idUsuario: resp.result.idUsuario }})
        }
        this.spinnerOn=false;
      },(error) => {
        console.log(error);
        this.usersFormDialog.open(
          usersFormModalComponent,
          this.errorModalInfo("Ha ocurrido un error inesperado, por favor, vuelve a intentarlo más tarde.")
        );
        this.spinnerOn=false;
      });
  }


}
