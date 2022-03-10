import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Provincia } from 'src/app/core/models/interfaces/provincia';
import { CurriculumService } from 'src/app/curriculum/curriculum.service';
import { HeaderService } from 'src/app/shared/header/header.service';
import { TokenService } from '../../login/token.service';
import { usersFormModalComponent } from '../../users/modals/users-form-modal.component';
import { LanguageService } from './language.service';

@Component({
  selector: 'private-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss'],
})
export class LanguageComponent {
  displayedColumns: string[] = ['idioma', 'nivel', 'delete'];
  formLanguageGroup: FormGroup;
  user: any;
  idCurriculum: string;
  languages: any;
  languagesCurriculum: any[];
  languageToAdd: any;
  errorMsg: string;
  selectedProvince: Provincia | undefined;
  spinnerOn = false;
  constructor(
    private fb: FormBuilder,
    private headerService: HeaderService,
    private activatedRoute: ActivatedRoute,
    private curriculumService: CurriculumService,
    private languageService: LanguageService,
    private tokenService: TokenService,
    private languageFormDialog: MatDialog
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
    this.user = this.tokenService.getUser();

    this.curriculumService
      .getCurriculums(this.user.idUsuario)
      .subscribe((curriculum) => {
        if (curriculum.length > 0) {
          this.idCurriculum = curriculum[0].idCurriculum;
          this.languagesCurriculum = curriculum[0].idiomas;

          this.languageService.getLanguages().subscribe((languages) => {
            this.languages = languages;
          });

          this.resetLanguage();

          this.formLanguageGroup = this.fb.group(this.languageToAdd);
          this.formLanguageGroup
            .get('idCurriculum')
            ?.setValidators(Validators.required);
          this.formLanguageGroup
            .get('idIdioma')
            ?.setValidators(Validators.required);
          this.formLanguageGroup
            .get('nivel')
            ?.setValidators(Validators.required);
        }
      });
  }

  resetLanguage() {
    this.languageToAdd = {
      idCurriculum: this.idCurriculum,
      idIdioma: '',
      nivel: '',
    };
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

  onDeleteClick(language: any) {
    this.languageService.deleteLanguageCurriculum(language).subscribe(
      (resp) => {
        if (resp.status && resp.status === 'ok') {
          const formUserModal = this.languageFormDialog.open(
            usersFormModalComponent,
            {
              maxWidth: '300px',
              data: {
                header: 'info',
                type: 'ok',
                msg: 'Idioma eliminado correctamente.',
              },
            }
          );
          this.curriculumService
            .getCurriculums(this.user.idUsuario)
            .subscribe((curriculum) => {
              if (curriculum.length > 0) {
                this.languagesCurriculum = curriculum[0].idiomas;
              }
            });
        }
        this.spinnerOn = false;
      },
      (error) => {
        this.languageFormDialog.open(
          usersFormModalComponent,
          this.errorModalInfo(
            'Ha ocurrido un error inesperado, por favor, vuelve a intentarlo más tarde.'
          )
        );
        this.spinnerOn = false;
      }
    );
  }

  onSubmit() {
    this.spinnerOn = true;

    this.languageToAdd = {
      ...this.formLanguageGroup.value,
    };

    this.languageService.createLanguageCurriculum(this.languageToAdd).subscribe(
      (resp) => {
        if (resp.status && resp.status === 'ok') {
          const formUserModal = this.languageFormDialog.open(
            usersFormModalComponent,
            {
              maxWidth: '300px',
              data: {
                header: 'info',
                type: 'ok',
                msg: 'Idioma correctamente.',
              },
            }
          );
          this.curriculumService
            .getCurriculums(this.user.idUsuario)
            .subscribe((curriculum) => {
              if (curriculum.length > 0) {
                this.languagesCurriculum = curriculum[0].idiomas;
              }
            });
        }
        this.spinnerOn = false;
      },
      (error) => {
        this.languageFormDialog.open(
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
