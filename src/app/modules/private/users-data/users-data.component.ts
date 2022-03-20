import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MAX_LENGTH } from 'src/app/core/enums/max-length.enum';
import { Curriculum } from 'src/app/core/models/interfaces/curriculum';
import { Provincia } from 'src/app/core/models/interfaces/provincia';
import { User } from 'src/app/core/models/interfaces/user';
import { CurriculumService } from 'src/app/curriculum/curriculum.service';
import { HeaderService } from 'src/app/shared/header/header.service';
import { TokenService } from '../../login/token.service';
import { UsersFormModalService } from '../../users/modals/users-form-modal.service';
import { provinciasService } from '../../users/provincias.service';
import { UsersService } from '../../users/users.service';

@Component({
  selector: 'private-users-data',
  templateUrl: './users-data.component.html',
  styleUrls: ['./users-data.component.scss'],
})
export class UsersDataComponent {
  formUserGroup: FormGroup;
  user: User;
  errorMsg: string;
  provinces: Provincia[];
  selectedProvince: Provincia | undefined;
  spinnerOn = false;
  chargeForm = false;
  curriculum: Curriculum;
  isPrivate: boolean;
  lengthForm: any;
  constructor(
    private fb: FormBuilder,
    private headerService: HeaderService,
    private activatedRoute: ActivatedRoute,
    private usersService: UsersService,
    private tokenService: TokenService,
    private provinciasService: provinciasService,
    private curriculumService: CurriculumService,
    private usersFormModalService:UsersFormModalService,
    private router: Router
  ) {}

  ngOnInit() {
    /*A través del servicio activatedRoute, llamo al servicio headerService, el cual está a la escucha del segmento de url que se le pasa como string.
    Eso hará que desde la cabecera podamos suscribirnos a dicho servicio y saber en que url estamos en cada momento.*/

    this.lengthForm = {
      nombre: MAX_LENGTH.LENGTH_50,
      apellidos: MAX_LENGTH.LENGTH_100,
      cp: MAX_LENGTH.LENGTH_5,
      acercaDe: MAX_LENGTH.LENGTH_500,
      telefonos: MAX_LENGTH.LENGTH_15,
      facebook: MAX_LENGTH.LENGTH_150,
      linkedin: MAX_LENGTH.LENGTH_150,
      instagram: MAX_LENGTH.LENGTH_150,
      password: MAX_LENGTH.LENGTH_50,
    }
    this.formUserGroup = this.fb.group({});
    this.resetForm();
    this.setValidators();
    this.activatedRoute.url.subscribe((urlSegment) =>
      this.headerService.changeUrl(urlSegment[0].path)
    );

    this.usersService
      .getUser(this.tokenService.getUser().idUsuario)
      .subscribe((userData) => {
        this.user.idUsuario = userData[0].idUsuario;
        this.user.nombre = userData[0].nombre;
        this.user.apellidos = userData[0].apellidos;
        this.user.cp = userData[0].cp;
        this.user.telefono1 = userData[0].telefono1;
        this.user.telefono2 = userData[0].telefono2;
        this.user.facebook = userData[0].facebook;
        this.user.twitter = userData[0].twitter;
        this.user.instagram = userData[0].instagram;
        this.user.linkedin = userData[0].linkedin;
        this.user.acercaDe = userData[0].acercaDe;

        if (this.user.idUsuario) {
          this.curriculumService
            .getCurriculums(this.user.idUsuario)
            .subscribe((curriculum) => {
              this.curriculum = curriculum[0];
              if(Number(this.curriculum.esPrivado)===1) this.isPrivate = true;

              this.formUserGroup = this.fb.group({
                ...this.user,
              });

              this.provinciasService.getProvincias().subscribe((provinces) => {
                this.provinces = provinces;

                this.onCpPressKey(this.user.cp);
                this.chargeForm = true;
              });

              this.setValidators();
            });
        }
      });
  }

  setValidators() {
    this.formUserGroup.get('nombre')?.setValidators([Validators.required, Validators.maxLength(this.lengthForm.nombre)]);
    this.formUserGroup.get('apellidos')?.setValidators([Validators.required, Validators.maxLength(this.lengthForm.apellidos)]);
    this.formUserGroup.get('cp')?.setValidators([Validators.required, Validators.maxLength(this.lengthForm.cp)]);
    this.formUserGroup
      .get('twitter')
      ?.setValidators(Validators.pattern('^@[A-Za-z0-9_]{1,15}$'));

    this.formUserGroup.get('telefono1')?.setValidators([Validators.pattern('^[0-9]*$'),  Validators.maxLength(this.lengthForm.telefonos)]);
    this.formUserGroup.get('telefono2')?.setValidators([Validators.pattern('^[0-9]*$'),  Validators.maxLength(this.lengthForm.telefonos)]);
    this.formUserGroup.get('facebook')?.setValidators([ Validators.maxLength(this.lengthForm.facebook)]);
    this.formUserGroup.get('linkedin')?.setValidators([ Validators.maxLength(this.lengthForm.linkedin)]);
    this.formUserGroup.get('instagram')?.setValidators([ Validators.maxLength(this.lengthForm.instagram)]);
    this.formUserGroup.get('acercaDe')?.setValidators([Validators.maxLength(this.lengthForm.acercaDe)]);

  }

  resetForm() {
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
      idRol: '',
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
            const usersFormModal = this.usersFormModalService.openModal(false, ' El DNI introducido pertenece a un usuario ya existente.');
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
            const usersFormModal = this.usersFormModalService.openModal(false, ' El E-mail introducido pertenece a un usuario ya existente.');

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
    this.usersService.updateUser(this.user).subscribe(
      (resp) => {
        if (resp.status && resp.status === 'ok') {
          this.usersFormModalService.openModal(true, 'Has modificado tus datos personales correctamente.')

        }
        this.spinnerOn = false;
      },
      () => {
        this.usersFormModalService.openModal(false, 'Ha ocurrido un error inesperado, por favor, vuelve a intentarlo más tarde.')
        this.spinnerOn = false;
      }
    );
  }

  goToCurriculum(){
    this.router.navigate([this.curriculum.alias])
  }

}
