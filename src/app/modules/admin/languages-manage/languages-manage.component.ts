import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import { Language } from 'src/app/core/models/interfaces/language';
import { HeaderService } from 'src/app/shared/header/header.service';
import { TokenService } from '../../login/token.service';
import { LanguageService } from '../../private/language/language.service';
import { UsersFormModalService } from '../../users/modals/users-form-modal.service';

@Component({
  selector: 'admin-languages-manage',
  templateUrl: './languages-manage.component.html',
  styleUrls: ['./languages-manage.component.scss'],
})
export class LanguagesManageComponent {
  displayedColumns: string[] = ['idioma', 'delete'];
  formLanguageGroup: FormGroup;
  languages: Language[] = [];
  languageToAdd: Language;
  errorMsg: string;
  chargeCompleted = false;
  maxLengthLanguage = 15;
  spinnerOn = false;
  constructor(
    private fb: FormBuilder,
    private headerService: HeaderService,
    private activatedRoute: ActivatedRoute,
    private languagesService: LanguageService,
    private tokenService: TokenService,
    private usersFormModalService: UsersFormModalService,
    private router: Router
  ) {
    this.formLanguageGroup = fb.group({});
    //this.resetUser();
  }

  ngOnInit() {
    /*A través del servicio activatedRoute, llamo al servicio headerService, el cual está a la escucha del segmento de url que se le pasa como string.
    Eso hará que desde la cabecera podamos suscribirnos a dicho servicio y saber en que url estamos en cada momento.*/

    this.activatedRoute.url.subscribe((urlSegment) =>
      this.headerService.changeUrl(urlSegment[0].path)
    );

    this.languagesService
    .getLanguages()
    .subscribe((languages) => {
      this.languages = languages;
      this.chargeCompleted = true;
    });

  this.resetInterestingData();
  this.setValidators();
  }

  resetInterestingData() {
    this.languageToAdd = {
      idioma: '',
    };
  }

  setValidators() {
    this.formLanguageGroup = this.fb.group(this.languageToAdd);
    this.formLanguageGroup
      .get('idioma')
      ?.setValidators([
        Validators.required,
        Validators.maxLength(this.maxLengthLanguage),
      ]);

  }

  onDeleteClick(language: any) {
    this.languagesService
      .deleteLanguage(language)
      .subscribe(
        (resp) => {
          if (resp.status && resp.status === 'ok') {
            this.usersFormModalService.openModal(true, 'Idioma eliminado correctamente.');
            this.getLanguages();
          }
          this.spinnerOn = false;
        },
        () => {

          this.usersFormModalService.openModal(false, 'Ha ocurrido un error inesperado, por favor, vuelve a intentarlo más tarde.');
          this.spinnerOn = false;
        }
      );
  }

  getLanguages() {
    this.languagesService
      .getLanguages()
      .subscribe((languages) => {
        this.languages = languages;
      });
  }

  onSubmit() {
    this.spinnerOn = true;

    this.languageToAdd = {
      ...this.formLanguageGroup.value,
    };

    this.languagesService
      .createLanguage(this.languageToAdd)
      .subscribe(
        (resp) => {
          if (resp.status && resp.status === 'ok') {
            this.usersFormModalService.openModal(true, 'Idioma añadido correctamente.');

            this.getLanguages();
            this.resetInterestingData();

            this.formLanguageGroup = this.fb.group(this.languageToAdd);
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
    this.formLanguageGroup = this.fb.group(this.languageToAdd);
    this.setValidators();
  }




}
