import { BreakpointObserver } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Curriculum } from 'src/app/core/models/interfaces/curriculum';
import { Education } from 'src/app/core/models/interfaces/education';
import { CurriculumService } from 'src/app/curriculum/curriculum.service';
import { HeaderService } from 'src/app/shared/header/header.service';
import { TokenService } from '../../login/token.service';
import { usersFormModalComponent } from '../../users/modals/users-form-modal.component';
import { UsersFormModalService } from '../../users/modals/users-form-modal.service';
import { EducationsService } from './educations.service';

@Component({
  selector: 'private-educations',
  templateUrl: './educations.component.html',
  styleUrls: ['./educations.component.scss'],
})
export class EducationsComponent {
  displayedColumns: string[] = ['titulo', 'centro', 'fechaComienzo', 'fechaFinalizacion','actions'];
  displayedColumnsSmallScreens: string[] = [
    'info',
    'actions',
  ];
  isSmallScreen = false;
  user: any;
  idCurriculum: string;
  curriculum: Curriculum;
  educations: Education[] = [];
  errorMsg: string;
  chargeCompleted = false;
  spinnerOn = false;
  constructor(
    private headerService: HeaderService,
    private activatedRoute: ActivatedRoute,
    private curriculumService: CurriculumService,
    private educationsService: EducationsService,
    private tokenService: TokenService,
    private usersFormModalService: UsersFormModalService,
    private breakpointObserver:BreakpointObserver,
    private router:Router
  ) {}

  ngOnInit() {
    //Nos suscribimos a breackpointobserver para escuchar cuando cambia el tamaño de la pantalla y cambiar el flag cuando se pasa el límite de 500px
    this.breakpointObserver.observe(['(max-width: 550px)']).subscribe((state) => this.isSmallScreen = state.matches);

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

          this.getEducations();
          this.chargeCompleted = true;

        }
      });
  }

  onDeleteClick(education: Education) {
    this.educationsService.deleteEducation(education).subscribe(
      (resp) => {
        if (resp.status && resp.status === 'ok') {
          this.usersFormModalService.openModal(true, 'Formación eliminada correctamente.');
          this.getEducations();
        }
        this.spinnerOn = false;
      },
      () => {

        this.usersFormModalService.openModal(false, ' Ha ocurrido un error inesperado, por favor, vuelve a intentarlo más tarde.');
        this.spinnerOn = false;
      }
    );
  }

  onUpdateClick(education:Education){
    this.router.navigate(['private', 'education', 'form'], { queryParams: {idFormacion: education.idFormacion}});
  }

  onAddClick(){
    this.router.navigate(['private', 'education', 'form']);
  }
  getEducations(){
    this.educationsService.getEducations(this.idCurriculum)
    .subscribe((educations) => {
      this.educations = educations;
    }, (error) => {
      console.log(error)
    });
  }

  goToCurriculum(){
    this.router.navigate([this.curriculum.alias])
  }


}
