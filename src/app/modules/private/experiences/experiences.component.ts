import { BreakpointObserver } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Curriculum } from 'src/app/core/models/interfaces/curriculum';
import { Experience } from 'src/app/core/models/interfaces/experience';
import { CurriculumService } from 'src/app/curriculum/curriculum.service';
import { HeaderService } from 'src/app/shared/header/header.service';
import { TokenService } from '../../login/token.service';
import { usersFormModalComponent } from '../../users/modals/users-form-modal.component';
import { UsersFormModalService } from '../../users/modals/users-form-modal.service';
import { ExperiencesService } from './experiences.service';

@Component({
  selector: 'private-experiences',
  templateUrl: './experiences.component.html',
  styleUrls: ['./experiences.component.scss'],
})
export class ExperiencesComponent {
  displayedColumns: string[] = ['empresa', 'cargo', 'fechaComienzo', 'fechaFinalizacion','actions'];
  displayedColumnsSmallScreens: string[] = [
    'info',
    'actions',
  ];
  isSmallScreen = false;
  user: any;
  idCurriculum: string;
  curriculum: Curriculum;
  experiences: Experience[] = [];
  errorMsg: string;
  spinnerOn = false;
  chargeCompleted = false;
  constructor(
    private headerService: HeaderService,
    private activatedRoute: ActivatedRoute,
    private curriculumService: CurriculumService,
    private experiencesService: ExperiencesService,
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
          this.idCurriculum = curriculum[0].idCurriculum;
          this.curriculum = curriculum[0];
          this.getExperiences();
          this.chargeCompleted = true;
        }
      });
  }

  onDeleteClick(experience: Experience) {
    this.experiencesService.deleteExperience(experience).subscribe(
      (resp) => {
        if (resp.status && resp.status === 'ok') {
          this.usersFormModalService.openModal(true, 'Experiencia profesional eliminada correctamente.');

          this.getExperiences();
        }
        this.spinnerOn = false;
      },
      () => {
        this.usersFormModalService.openModal(false, 'Ha ocurrido un error inesperado, por favor, vuelve a intentarlo más tarde.');

        this.spinnerOn = false;
      }
    );
  }

  onUpdateClick(experience:Experience){
    this.router.navigate(['private', 'experience', 'form'], { queryParams: {idExperiencia: experience.idExperiencia}});
  }

  onAddClick(){
    this.router.navigate(['private', 'experience', 'form']);
  }
  getExperiences(){
    this.experiencesService.getExperiences(this.idCurriculum)
    .subscribe((experience: Experience[]) => {
      this.experiences = experience.sort(
        (a, b) =>
          Number(new Date(b.fechaComienzo).getTime()) -
          Number(new Date(a.fechaComienzo).getTime())
      )
    });
  }

  goToCurriculum(){

    const url = this.router.createUrlTree(['/', this.curriculum.alias])
    window.open(url.toString(), '_blank')
  }


}
