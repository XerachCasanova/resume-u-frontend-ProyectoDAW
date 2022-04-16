import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ActivatedRoute, Router } from '@angular/router';
import { Language } from 'src/app/core/models/interfaces/language';
import { LanguageCurriculum } from 'src/app/core/models/interfaces/language-curriculum';
import { Provincia } from 'src/app/core/models/interfaces/provincia';
import { CurriculumService } from 'src/app/curriculum/curriculum.service';
import { HeaderService } from 'src/app/shared/header/header.service';
import { TokenService } from '../../login/token.service';
import { usersFormModalComponent } from '../../users/modals/users-form-modal.component';
import { UsersFormModalService } from '../../users/modals/users-form-modal.service';
import { LanguageService } from './language.service';
import { Curriculum } from 'src/app/core/models/interfaces/curriculum';

@Component({
  selector: 'private-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss'],
})
export class LanguageComponent {
  displayedColumns: string[] = ['idioma', 'nivel', 'delete'];
  displayedColumnsSmallScreen: string[] = ['info', 'actions'];
  isSmallScreen = false;
  formLanguageGroup: FormGroup;
  user: any;
  idCurriculum: string;
  languages: Language[] = [];
  chargeCompleted=false;
  languagesCurriculum: LanguageCurriculum[] = [];
  languageToAdd: LanguageCurriculum;
  errorMsg: string;
  curriculum: Curriculum;
  spinnerOn = false;
  constructor(
    private fb: FormBuilder,
    private headerService: HeaderService,
    private activatedRoute: ActivatedRoute,
    private curriculumService: CurriculumService,
    private languageService: LanguageService,
    private tokenService: TokenService,
    private usersFormModalService:UsersFormModalService,
    private breakpointObserver:BreakpointObserver,
    private router: Router
  ) {
    this.formLanguageGroup = fb.group({});

  }

  ngOnInit() {

    //Nos suscribimos a breackpointobserver para escuchar cuando cambia el tamaño de la pantalla y cambiar el flag cuando se pasa el límite de 500px
    this.breakpointObserver.observe(['(max-width: 500px)']).subscribe((state) => this.isSmallScreen = state.matches);

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
          this.languagesCurriculum = curriculum[0].idiomas;
          this.chargeCompleted = true;
          this.languageService.getLanguages().subscribe((languages: Language[]) => {
            this.languages = languages.sort(
              (a, b) =>
                {
                  if(a.idioma.toLowerCase() > b.idioma.toLowerCase()) return 1
                  else if (a.idioma.toLowerCase() < b.idioma.toLowerCase()) return -1;

                  return 0;
                }
            );
          });

          this.resetLanguage();


        }
      });
  }

  resetLanguage() {
    this.languageToAdd = {
      idCurriculum: this.idCurriculum,
      idIdioma: '',
      nivel: '',
    };

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

  onDeleteClick(language: any) {
    this.languageService.deleteLanguageCurriculum(language).subscribe(
      (resp) => {
        if (resp.status && resp.status === 'ok') {
          this.usersFormModalService.openModal(true, 'Idioma eliminado correctamente.')

          this.getCurriculums();
          this.resetLanguage();
        }
        this.spinnerOn = false;
      },
      () => {
        this.usersFormModalService.openModal(false,  'Ha ocurrido un error inesperado, por favor, vuelve a intentarlo más tarde.');

        this.spinnerOn = false;
      }
    );
  }

  getCurriculums() {
    this.curriculumService
      .getCurriculums(this.user.idUsuario)
      .subscribe((curriculum) => {
        if (curriculum.length > 0) {
          this.languagesCurriculum = curriculum[0].idiomas
        }
      });
  }

  onSubmit() {
    this.spinnerOn = true;

    this.languageToAdd = {
      ...this.formLanguageGroup.value,
    };

    this.languageService.createLanguageCurriculum(this.languageToAdd).subscribe(
      (resp) => {
        if (resp.status && resp.status === 'ok') {
          this.usersFormModalService.openModal(true, 'Idioma añadido correctamente.');

          this.getCurriculums();
        }
        this.spinnerOn = false;
      },
      () => {
        this.usersFormModalService.openModal(false, 'Ha ocurrido un error inesperado, por favor, vuelve a intentarlo más tarde.');
        this.spinnerOn = false;
      }
    );
  }

  goToCurriculum(){

    const url = this.router.createUrlTree(['/', this.curriculum.alias])
    window.open(url.toString(), '_blank')
  }
}
