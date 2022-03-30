import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MAX_LENGTH } from 'src/app/core/enums/max-length.enum';
import { Curriculum } from 'src/app/core/models/interfaces/curriculum';
import { CurriculumService } from 'src/app/curriculum/curriculum.service';
import { HeaderService } from 'src/app/shared/header/header.service';
import { environment } from 'src/environments/environment';
import { TokenService } from '../../login/token.service';
import { usersFormModalComponent } from '../../users/modals/users-form-modal.component';
import { UsersFormModalService } from '../../users/modals/users-form-modal.service';
import { UsersService } from '../../users/users.service';
import { ChargeImagesService } from '../chargeImages.service';

@Component({
  selector: 'private-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss'],
})
export class ConfigurationComponent {
  formCurriculumGroup: FormGroup;
  idUsuario: string;
  nameFocusField: string;
  errorMsg: string;
  apiUrl = environment.apiUrl;
  imageCompany: File;
  spinnerOn = false;
  spinnerImageOn = false;
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
    private curriculumService: CurriculumService,
    private chargeImagesService: ChargeImagesService,
    private usersFormModalService:UsersFormModalService,
    private router:Router
  ) {}

  ngOnInit() {
    /*A través del servicio activatedRoute, llamo al servicio headerService, el cual está a la escucha del segmento de url que se le pasa como string.
    Eso hará que desde la cabecera podamos suscribirnos a dicho servicio y saber en que url estamos en cada momento.*/

    this.lengthForm = {
      alias: MAX_LENGTH.LENGTH_100,
      profesion: MAX_LENGTH.LENGTH_50,
      web: MAX_LENGTH.LENGTH_150,
    };

    this.resetCurriculumForm();
    this.formCurriculumGroup = this.fb.group(this.curriculum);
    this.activatedRoute.url.subscribe((urlSegment) =>
      this.headerService.changeUrl(urlSegment[0].path)
    );

    this.usersService
      .getUser(this.tokenService.getUser().idUsuario)
      .subscribe((userData) => {
        this.idUsuario = userData[0].idUsuario;

        if (this.idUsuario) {
          this.getCurriculum();
        }
      });
  }

  getCurriculum() {
    this.curriculumService
      .getCurriculums(this.idUsuario)
      .subscribe((curriculum) => {
        this.curriculum = curriculum[0];
        if (Number(this.curriculum.esPrivado) === 1) {
          this.isPrivate = true;
          this.curriculum.esPrivado = true;
        } else {
          this.curriculum.esPrivado = false;
          this.curriculum.password = "isPublic"
        }

        this.formCurriculumGroup = this.fb.group(this.curriculum);
        this.setValidators();
        this.chargeForm = true;
      });
  }

  resetCurriculumForm() {
    this.curriculum = {
      acercaDe: '',
      alias: '',
      foto: '',
      gamaColores: '',
      idUsuario: '',
      profesion: '',
      web: '',
      idCurriculum: '',
      tipoHabilidades: '',
      password: 'isPublic',
      esPrivado: false,
    };
  }

  setValidators() {
    this.formCurriculumGroup
      .get('alias')
      ?.setValidators([
        Validators.required,
        Validators.maxLength(this.lengthForm.alias),
        Validators.pattern(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/)
      ]);
    this.formCurriculumGroup
      .get('profesion')
      ?.setValidators([
        Validators.required,
        Validators.maxLength(this.lengthForm.profesion),
      ]);
    this.formCurriculumGroup
      .get('web')
      ?.setValidators([Validators.maxLength(this.lengthForm.web)]);
    this.formCurriculumGroup
      .get('gamaColores')
      ?.setValidators([Validators.required]);
    this.formCurriculumGroup
      .get('tipoHabilidades')
      ?.setValidators([Validators.required]);
    this.formCurriculumGroup
      .get('password')
      ?.setValidators([Validators.required]);
  }


  onChargePicture($event: any) {
    this.spinnerImageOn = true;
    this.imageCompany = $event.target.files[0];
    const idCurriculum = this.curriculum.idCurriculum
      ? this.curriculum.idCurriculum
      : '0';
    const imageName = 'curriculum-photo-' + idCurriculum;

    this.chargeImagesService
      .postImage(this.imageCompany, imageName, 'curriculum', idCurriculum)
      .subscribe(
        (resp) => {
          this.usersFormModalService.openModal(true, 'Imagen subida correctamente. La foto se actualizará cuando recargues la página.');

          this.spinnerImageOn = false;
        },
        () => {
          this.usersFormModalService.openModal(false, 'Ha ocurrido un error inesperado. Por favor, vuelve a intentarlo más tarde o contacta con un administrador.');

          this.spinnerImageOn = false;
        }
      );
  }

  onIsPrivateClick() {
    this.isPrivate = !this.isPrivate;
    if (this.isPrivate) {
      this.formCurriculumGroup.get('password')?.setValue('');
    } else {
      this.formCurriculumGroup.get('password')?.setValue('isPublic');
    }
  }

  onCurriculumConfigSubmit() {
    this.spinnerOn = true;
    this.curriculum = this.formCurriculumGroup.value;
    this.curriculum.esPrivado = this.isPrivate;
    if (!this.isPrivate) delete this.curriculum.password;

    this.curriculumService.updateCurriculum(this.curriculum).subscribe(
      (resp) => {
        this.usersFormModalService.openModal(true, 'Currículum modificado correctamente.');
        this.spinnerOn = false;
      },
      (error) => {
        this.usersFormModalService.openModal(false, 'Ha ocurrido un error inesperado, por favor, vuelve a intentarlo más tarde.');
        this.spinnerOn = false;
      }
    );
  }


  checkAlias(){

    if(this.formCurriculumGroup.get('alias')?.value != '' && this.curriculum.idCurriculum){
      this.curriculumService.checkAlias(this.formCurriculumGroup.get('alias')?.value, this.curriculum.idCurriculum).subscribe((curriculums: Curriculum[]) => {

        if(curriculums.length > 0 && curriculums[0].idCurriculum !== this.curriculum.idCurriculum ){
          const modalForm = this.usersFormModalService.openModal(false, 'Este alias ya está escogido por otro usuario. Elige otro.')

          modalForm.afterClosed().subscribe(() => this.formCurriculumGroup.get('alias')?.setValue(''));
        }
      })
    }
  }

  goToCurriculum(){
    this.router.navigate([this.curriculum.alias])
  }

  resetForm() {
    this.formCurriculumGroup = this.fb.group(this.curriculum);
    this.setValidators();
  }



}
