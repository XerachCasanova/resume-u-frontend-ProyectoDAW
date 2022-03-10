import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Curriculum } from 'src/app/core/models/interfaces/curriculum';
import { Provincia } from 'src/app/core/models/interfaces/provincia';
import { User } from 'src/app/core/models/interfaces/user';
import { CurriculumService } from 'src/app/curriculum/curriculum.service';
import { HeaderService } from 'src/app/shared/header/header.service';
import { TokenService } from '../../login/token.service';
import { usersFormModalComponent } from '../../users/modals/users-form-modal.component';
import { provinciasService } from '../../users/provincias.service';
import { UsersService } from '../../users/users.service';

@Component({
  selector: 'private-users-data',
  templateUrl: './users-data.component.html',
  styleUrls: ['./users-data.component.scss'],
})
export class UsersDataComponent {
  formUserGroup: FormGroup;
  usuario: User;
  errorMsg: string;
  provinces: Provincia[];
  selectedProvince: Provincia | undefined;
  spinnerOn = false;
  chargeForm = false;
  curriculum: Curriculum;
  curriculumAcercaDe: any;
  constructor(
    private fb: FormBuilder,
    private headerService: HeaderService,
    private activatedRoute: ActivatedRoute,
    private usersService: UsersService,
    private tokenService: TokenService,
    private provinciasService: provinciasService,
    private usersFormDialog: MatDialog,
    private curriculumService: CurriculumService
  ) {

  }

  ngOnInit() {
    /*A través del servicio activatedRoute, llamo al servicio headerService, el cual está a la escucha del segmento de url que se le pasa como string.
    Eso hará que desde la cabecera podamos suscribirnos a dicho servicio y saber en que url estamos en cada momento.*/
    this.formUserGroup = this.fb.group({});
    this.resetForm();
    this.setValidators();
    this.activatedRoute.url.subscribe((urlSegment) =>
      this.headerService.changeUrl(urlSegment[0].path)
    );



    this.usersService
      .getUser(this.tokenService.getUser().idUsuario)
      .subscribe((userData) => {
        this.usuario.idUsuario = userData[0].idUsuario;
        this.usuario.nombre = userData[0].nombre;
        this.usuario.apellidos = userData[0].apellidos;
        this.usuario.cp = userData[0].cp;
        this.usuario.telefono1 = userData[0].telefono1;
        this.usuario.telefono2 = userData[0].telefono2;
        this.usuario.facebook = userData[0].facebook;
        this.usuario.twitter = userData[0].twitter;
        this.usuario.instagram = userData[0].instagram;
        this.usuario.linkedin = userData[0].linkedin;


        if (this.usuario.idUsuario) {
          this.curriculumService
            .getCurriculums(this.usuario.idUsuario)
            .subscribe((curriculum) => {
              this.curriculum = curriculum[0];
              this.curriculumAcercaDe = {acercaDe: this.curriculum.acercaDe, idCurriculum: this.curriculum.idCurriculum }
              this.formUserGroup = this.fb.group({
                ...this.usuario,
                formAcercaDeGroup: this.fb.group(this.curriculumAcercaDe),
              });

              this.provinciasService.getProvincias().subscribe((provinces) => {
                this.provinces = provinces;

                this.onCpPressKey(this.usuario.cp);
                this.chargeForm = true;
              });

              this.setValidators();

            });

        }


      });

    //this.formUserGroup = this.fb.group({...this.usuario,  formAcercaDeGroup: this.fb.group(this.curriculumAcercaDe)});

    //this.setValidators();

  }

  setValidators(){
    this.formUserGroup.get('nombre')?.setValidators(Validators.required);
    this.formUserGroup.get('apellidos')?.setValidators(Validators.required);
    this.formUserGroup.get('cp')?.setValidators([Validators.required]);
    this.formUserGroup
      .get('twitter')
      ?.setValidators(Validators.pattern('^@[A-Za-z0-9_]{1,15}$'));

    this.formUserGroup.get('formAcercaDeGroup')?.get('acercaDe')?.setValidators([Validators.maxLength(500)]);

  }

  resetForm() {
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
      activo: '',
      idRol: '',
    };

    this.curriculumAcercaDe = {
      idCurriculum: '',
      acercaDe: '',
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
            const usersFormModal = this.usersFormDialog.open(
              usersFormModalComponent,
              this.errorModalInfo(
                ' El DNI introducido pertenece a un usuario ya existente.'
              )
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
            const usersFormModal = this.usersFormDialog.open(
              usersFormModalComponent,
              this.errorModalInfo(
                ' El E-mail introducido pertenece a un usuario ya existente.'
              )
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

  errorModalInfo(errorMsg: string) {
    return {
      maxWidth: '300px',
      data: {
        header: 'error',
        type: 'error',
        errorMsg: errorMsg,
      },
    };
  }

  onSubmit() {
    this.spinnerOn = true;
    this.usuario = {
      ...this.formUserGroup.value,
      provincia: this.selectedProvince?.idProvincia,
    };

    this.usersService.updateUser(this.usuario).subscribe(
      (resp) => {
        if (resp.status && resp.status === 'ok') {
          const formUserModal = this.usersFormDialog.open(
            usersFormModalComponent,
            {
              maxWidth: '300px',
              data: {
                header: 'info',
                type: 'ok',
                msg: 'Has modificado tus datos personales correctamente.',
              },
            }
          );


          this.curriculumAcercaDe = this.formUserGroup.get("formAcercaDeGroup")?.value;

          this.curriculumService.updateCurriculum(this.curriculumAcercaDe).subscribe();
        }
        this.spinnerOn = false;
      },
      (error) => {

        this.usersFormDialog.open(
          usersFormModalComponent,
          this.errorModalInfo(
            'Ha ocurrido un error inesperado, por favor, vuelve a intentarlo más tarde.'
          )
        );
        this.spinnerOn = false;
      }
    );
  }
}
