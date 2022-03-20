import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { Curriculum } from 'src/app/core/models/interfaces/curriculum';
import { InterestingData } from 'src/app/core/models/interfaces/interesting-data';
import { CurriculumService } from 'src/app/curriculum/curriculum.service';
import { HeaderService } from 'src/app/shared/header/header.service';
import { TokenService } from '../../login/token.service';
import { UsersFormModalService } from '../../users/modals/users-form-modal.service';
import { InterestingDataService } from './interesting-data.service';

@Component({
  selector: 'private-interesting-data',
  templateUrl: './interesting-data.component.html',
  styleUrls: ['./interesting-data.component.scss'],
})
export class InterestingDataComponent {
  displayedColumns: string[] = ['descripcion', 'delete'];
  formInterestingDataGroup: FormGroup;
  user: any;
  idCurriculum: string;
  curriculum: Curriculum
  interestingData: InterestingData[] = [];
  interestingDataToAdd: InterestingData;
  errorMsg: string;
  chargeCompleted = false;
  maxLengthDescription = 30;
  spinnerOn = false;
  constructor(
    private fb: FormBuilder,
    private headerService: HeaderService,
    private activatedRoute: ActivatedRoute,
    private curriculumService: CurriculumService,
    private interestingDataService: InterestingDataService,
    private tokenService: TokenService,
    private usersFormModalService: UsersFormModalService,
    private router: Router
  ) {
    this.formInterestingDataGroup = fb.group({});
    //this.resetUser();
  }

  ngOnInit() {
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
          this.curriculum = curriculum[0];
          this.idCurriculum = curriculum[0].idCurriculum;

          this.interestingDataService
            .getInterestingData(this.idCurriculum)
            .subscribe((interestingData) => {
              this.interestingData = interestingData;
              this.chargeCompleted = true;
            });

          this.resetInterestingData();
          this.setValidators();
        }
      });
  }

  resetInterestingData() {
    this.interestingDataToAdd = {
      idCurriculum: this.idCurriculum,
      descripcion: '',
      idDatoInteres: '',
    };
  }

  setValidators() {
    this.formInterestingDataGroup = this.fb.group(this.interestingDataToAdd);
    this.formInterestingDataGroup
      .get('descripcion')
      ?.setValidators([
        Validators.required,
        Validators.maxLength(this.maxLengthDescription),
      ]);
    this.formInterestingDataGroup
      .get('idCurriculum')
      ?.setValidators(Validators.required);
  }

  onDeleteClick(interestingData: any) {
    this.interestingDataService
      .deleteInterestingData(interestingData)
      .subscribe(
        (resp) => {
          if (resp.status && resp.status === 'ok') {
            this.usersFormModalService.openModal(true, 'Dato de interés eliminado correctamente.');
            this.getDatosInteres();
          }
          this.spinnerOn = false;
        },
        () => {
          this.usersFormModalService.openModal(false, 'Ha ocurrido un error inesperado, por favor, vuelve a intentarlo más tarde.');
          this.spinnerOn = false;
        }
      );
  }

  getDatosInteres() {
    this.interestingDataService
      .getInterestingData(this.idCurriculum)
      .subscribe((interestingData) => {
        this.interestingData = interestingData;
      });
  }

  onSubmit() {
    this.spinnerOn = true;

    this.interestingDataToAdd = {
      ...this.formInterestingDataGroup.value,
    };

    this.interestingDataService
      .createInterestingData(this.interestingDataToAdd)
      .subscribe(
        (resp) => {
          if (resp.status && resp.status === 'ok') {
            this.usersFormModalService.openModal(true, 'Dato de interés añadido correctamente.');

            this.getDatosInteres();
            this.resetInterestingData();

            this.formInterestingDataGroup = this.fb.group(this.interestingDataToAdd);
            this.setValidators();
          }
          this.spinnerOn = false;
        },
        () => {
          this.usersFormModalService.openModal(false, 'Ha ocurrido un error inesperado, por favor, vuelve a intentarlo más tarde.');

          this.spinnerOn = false;
        }
      );
  }

  resetForm() {
    this.formInterestingDataGroup = this.fb.group(this.interestingDataToAdd);
    this.setValidators();
  }

  goToCurriculum(){
    this.router.navigate([this.curriculum.alias])
  }



}
