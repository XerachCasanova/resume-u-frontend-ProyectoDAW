import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Experience } from 'src/app/core/models/interfaces/experience';
import { CurriculumService } from 'src/app/curriculum/curriculum.service';
import { TokenService } from 'src/app/modules/login/token.service';
import { HeaderService } from 'src/app/shared/header/header.service';
import { environment } from 'src/environments/environment';
import { ChargeImagesService } from '../../chargeImages.service';


import { ExperiencesService } from '../experiences.service';
import { MAX_LENGTH } from 'src/app/core/enums/max-length.enum';
import { UsersFormModalService } from 'src/app/modules/users/modals/users-form-modal.service';

@Component({
  selector: 'private-experience-form',
  templateUrl: './experience-form.component.html',
  styleUrls: ['./experience-form.component.scss'],
})
export class ExperienceFormComponent {

  colorFileControl: ThemePalette = 'primary'
  formExperienceGroup: FormGroup;
  isAdding=false;
  titleForm = 'Modificar experiencia laboral';
  user: any;
  apiUrl = environment.apiUrl;
  workingNowadays=false;
  idCurriculum: string;
  idExperiencia: string;
  experience: Experience;
  imageCompany: File;
  errorMsg: string;
  spinnerOn = false;
  lengthForm: any;

  constructor(
    private fb: FormBuilder,
    private headerService: HeaderService,
    private activatedRoute: ActivatedRoute,
    private curriculumService: CurriculumService,
    private experiencesService: ExperiencesService,
    private tokenService: TokenService,
    private routeParams: ActivatedRoute,
    private router: Router,
    private chargeImagesService:ChargeImagesService,
    private usersFormModalService: UsersFormModalService
  ) {
    this.formExperienceGroup = this.fb.group({});
  }

  ngOnInit() {

    this.lengthForm = {
      tareas: MAX_LENGTH.LENGTH_500,
      descripcion: MAX_LENGTH.LENGTH_500,
      empresa: MAX_LENGTH.LENGTH_50,
      cargo: MAX_LENGTH.LENGTH_50,
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
          this.routeParams.queryParams.subscribe((params) => {
            if (params.idExperiencia) {
              this.idExperiencia = params.idExperiencia;
            }

            if (this.idExperiencia && this.idExperiencia != '') {
              this.experiencesService
                .getExperience(this.idExperiencia)
                .subscribe((experiences) => {

                  this.experience = experiences[0];

                  if(this.experience.fechaFinalizacion === null) this.workingNowadays = true;
                  this.formExperienceGroup = this.fb.group(this.experience);

                  this.setValidators();
                });
            } else {

              this.resetExperience();
              this.setValidators();
              this.isAdding=true;
              this.titleForm = 'Añadir experiencia laboral';
            }
          });
        }
      });


  }

  onChargePicture($event:any){

    this.imageCompany = $event.target.files[0];


  }

  resetExperience() {
    this.experience = {
      idExperiencia: '',
      tareas: '',
      cargo: '',
      descripcion: '',
      empresa: '',
      fechaComienzo: '',
      fechaFinalizacion: '',
      idCurriculum: this.idCurriculum,
    };

    this.formExperienceGroup = this.fb.group(this.experience);
  }

  setValidators(){
    this.formExperienceGroup
    .get('idCurriculum')
    ?.setValidators([Validators.required]);

    this.formExperienceGroup
    .get('empresa')
    ?.setValidators([Validators.required, Validators.maxLength(this.lengthForm.empresa)]);

    this.formExperienceGroup
    .get('cargo')
    ?.setValidators([Validators.required, Validators.maxLength(this.lengthForm.cargo)]);

    this.formExperienceGroup
    .get('descripcion')
    ?.setValidators([Validators.maxLength(this.lengthForm.descripcion)]);

    this.formExperienceGroup
    .get('fechaComienzo')
    ?.setValidators([Validators.required]);

    this.formExperienceGroup
    .get('fechaFinalizacion')
    ?.setValidators([Validators.required]);


    this.formExperienceGroup
    .get('tareas')
    ?.setValidators([Validators.maxLength(this.lengthForm.tareas)]);
  }

  onSubmit() {
    this.spinnerOn = true;

    this.experience = {
      ...this.formExperienceGroup.value,
    };

    if(this.workingNowadays) this.experience.fechaFinalizacion = null

    if(this.isAdding){

      delete this.experience.idExperiencia;

      this.experiencesService.createExperience(this.experience).subscribe(
        (resp) => {

          if (resp.status && resp.status === 'ok') {
           this.apiCallResponseOk(resp, "añadida");
           this.uploadImage(resp.result.idExperiencia);
          }
          this.spinnerOn = false;
        },
        (error) => {
          this.apiCallResponseError();
        }
      );
    } else {
      this.experiencesService.updateExperience(this.experience).subscribe(
        (resp) => {
          if (resp.status && resp.status === 'ok') {
            this.apiCallResponseOk(resp, "modificada");
            if(this.experience.idExperiencia) this.uploadImage(this.experience.idExperiencia);
          }
          this.spinnerOn = false;
        },
        (error) => {
          this.apiCallResponseError();
        }
      );
    }

  }

  uploadImage(id:string){

    const imageName = "company-logo-exp"+id;

    this.chargeImagesService.postImage(this.imageCompany, imageName, 'experiencia', id).subscribe(
			res => {
        return res === 'ok';

			},
			error => {

				return false;
			}

		);

  }

  apiCallResponseOk(resp:any, action: string){
    if (resp.status && resp.status === 'ok') {
      const usersModal = this.usersFormModalService.openModal(true, 'Experiencia laboral ' + action + ' correctamente.');

      usersModal.afterClosed().subscribe(() => this.router.navigate(['private', 'experience']));
    }
    this.spinnerOn = false;

  }

  apiCallResponseError(){

    this.usersFormModalService.openModal(false, 'Ha ocurrido un error inesperado, por favor, vuelve a intentarlo más tarde.');

    this.spinnerOn = false;
  }

  checkEndingDate(){

    if(!this.workingNowadays){
      const fechaComienzo = new Date(this.formExperienceGroup.get('fechaComienzo')?.value).getTime();
      const fechaFinalizacion = new Date(this.formExperienceGroup.get('fechaFinalizacion')?.value).getTime()

      if(!isNaN(fechaComienzo) && !isNaN(fechaFinalizacion)){
        if(fechaFinalizacion - fechaComienzo < 0){
          const usersModal = this.usersFormModalService.openModal(false, 'La fecha de finalización debe ser posterior a la de comienzo');

          usersModal.afterClosed().subscribe(() => {
            this.formExperienceGroup.get('fechaFinalizacion')?.setValue('');
          })
        }
      }
    }

  }

  onWorkingNowadaysClick(){
    this.workingNowadays = !this.workingNowadays;
    if(this.workingNowadays) this.formExperienceGroup.get('fechaFinalizacion')?.setValue(new Date(Date.now()));
    else this.formExperienceGroup.get('fechaFinalizacion')?.setValue(null);



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

  resetForm() {
    this.formExperienceGroup = this.fb.group(this.experience);
    this.setValidators();
  }
}
