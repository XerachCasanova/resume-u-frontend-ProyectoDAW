import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MAX_LENGTH } from 'src/app/core/enums/max-length.enum';
import { Education } from 'src/app/core/models/interfaces/education';
import { CurriculumService } from 'src/app/curriculum/curriculum.service';
import { TokenService } from 'src/app/modules/login/token.service';
import { usersFormModalComponent } from 'src/app/modules/users/modals/users-form-modal.component';
import { UsersFormModalService } from 'src/app/modules/users/modals/users-form-modal.service';
import { HeaderService } from 'src/app/shared/header/header.service';
import { environment } from 'src/environments/environment';

import { EducationsService } from '../educations.service';

@Component({
  selector: 'private-education-form',
  templateUrl: './education-form.component.html',
  styleUrls: ['./education-form.component.scss'],
})
export class EducationFormComponent {

  colorFileControl: ThemePalette = 'primary'
  formEducationGroup: FormGroup;
  isAdding=false;
  titleForm = 'Modificar formación';
  maxLengthTextareas = 300;
  user: any;
  apiUrl = environment.apiUrl;
  cursandoActualmente=false;
  idCurriculum: string;
  idFormacion: string;
  education: Education;
  errorMsg: string;
  spinnerOn = false;
  lengthForm: any

  constructor(
    private fb: FormBuilder,
    private headerService: HeaderService,
    private activatedRoute: ActivatedRoute,
    private curriculumService: CurriculumService,
    private educationsService: EducationsService,
    private tokenService: TokenService,
    private usersFormModalService: UsersFormModalService,
    private routeParams: ActivatedRoute,
    private router: Router,
  ) {
    this.formEducationGroup = this.fb.group({});
  }

  ngOnInit() {

    this.lengthForm = {
      titulo: MAX_LENGTH.LENGTH_100,
      centro: MAX_LENGTH.LENGTH_100,
      descripcion: MAX_LENGTH.LENGTH_500,
    };

    /*A través del servicio activatedRoute, llamo al servicio headerService, el cual está a la escucha del segmento de url que se le pasa como string.
    Eso hará que desde la cabecera podamos suscribirnos a dicho servicio y saber en que url estamos en cada momento.*/

    this.activatedRoute.url.subscribe((urlSegment) =>
      this.headerService.changeUrl(urlSegment[0].path)
    );
    this.user = this.tokenService.getUser();

    this.curriculumService
      .getCurriculums(this.user.idUsuario)
      .subscribe((curriculum) => {
        if (curriculum.length > 0) {
          this.idCurriculum = curriculum[0].idCurriculum;
          this.resetEducation();
          this.setValidators();
          this.routeParams.queryParams.subscribe((params) => {
            if (params.idFormacion) {
              this.idFormacion = params.idFormacion;
            }

            if (this.idFormacion && this.idFormacion != '') {
              this.educationsService
                .getEducation(this.idFormacion)
                .subscribe((educations) => {

                  this.education = educations[0];
                  this.education.esTitulacionOficial = Boolean(Number(educations[0].esTitulacionOficial));
                  if(this.education.fechaFinalizacion === null) this.cursandoActualmente = true;
                  this.formEducationGroup = this.fb.group(this.education);

                });
            } else {

              this.resetEducation();
              this.setValidators();
              this.isAdding=true;
              this.titleForm = 'Añadir formación';
            }
          });
        }
      });

  }


  resetEducation() {
    this.education = {
      idFormacion: '',
      titulo: '',
      descripcion: '',
      esTitulacionOficial: false,
      centro: '',
      fechaComienzo: '',
      fechaFinalizacion: '',
      idCurriculum: this.idCurriculum,
    };

    this.formEducationGroup = this.fb.group(this.education);
  }

  setValidators(){
    this.formEducationGroup
    .get('idCurriculum')
    ?.setValidators([Validators.required]);

    this.formEducationGroup
    .get('titulo')
    ?.setValidators([Validators.required, Validators.maxLength(this.lengthForm.titulo)]);

    this.formEducationGroup
    .get('centro')
    ?.setValidators([Validators.required, Validators.maxLength(this.lengthForm.centro)]);

    this.formEducationGroup
    .get('descripcion')
    ?.setValidators([Validators.maxLength(this.lengthForm.descripcion)]);

    this.formEducationGroup
    .get('fechaComienzo')
    ?.setValidators([Validators.required]);
  }



  onSubmit() {
    this.spinnerOn = true;

    this.education = {
      ...this.formEducationGroup.value,
    };

    console.log(this.education)

    if(this.cursandoActualmente) this.education.fechaFinalizacion = null

    if(this.isAdding){

      delete this.education.idFormacion;

      this.educationsService.createEducation(this.education).subscribe(
        (resp) => {

          if (resp.status && resp.status === 'ok') {
           this.apiCallResponseOk(resp, "añadida");
          }
          this.spinnerOn = false;
        },
        () => {
          this.apiCallResponseError();
        }
      );
    } else {
      this.educationsService.updateEducation(this.education).subscribe(
        (resp) => {
          if (resp.status && resp.status === 'ok') {
            this.apiCallResponseOk(resp, "modificada");
          }
          this.spinnerOn = false;
        },
        () => {
          this.apiCallResponseError();
        }
      );
    }

  }

  checkEndingDate(){
    const fechaComienzo = new Date(this.formEducationGroup.get('fechaComienzo')?.value).getTime();
    const fechaFinalizacion = new Date(this.formEducationGroup.get('fechaFinalizacion')?.value).getTime()

    if(!isNaN(fechaComienzo) && !isNaN(fechaFinalizacion)){
      if(fechaFinalizacion - fechaComienzo < 0){
        const usersModal = this.usersFormModalService.openModal(false, 'La fecha de finalización debe ser posterior a la de comienzo');

        usersModal.afterClosed().subscribe(() => {
          this.formEducationGroup.get('fechaFinalizacion')?.setValue('');
        })
      }
    }
  }

  apiCallResponseOk(resp:any, action: string){
    if (resp.status && resp.status === 'ok') {

      const usersModal = this.usersFormModalService.openModal(true, 'Formación laboral ' + action + ' correctamente.')

      usersModal.afterClosed().subscribe(() => this.router.navigate(['private', 'education']));
    }
    this.spinnerOn = false;

  }

  apiCallResponseError(){
    this.usersFormModalService.openModal(false, 'Ha ocurrido un error inesperado, por favor, vuelve a intentarlo más tarde.')

    this.spinnerOn = false;
  }

  onCoursingNowadaysClick(){

    if(this.cursandoActualmente) this.formEducationGroup.get('fechaFinalizacion')?.setValue(new Date(Date.now()));
    else this.formEducationGroup.get('fechaFinalizacion')?.setValue(null);

    this.cursandoActualmente = !this.cursandoActualmente;

  }


  resetForm() {
    this.formEducationGroup = this.fb.group(this.education);
    this.setValidators();
  }
}
