import { BreakpointObserver } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MAX_LENGTH } from 'src/app/core/enums/max-length.enum';
import { Curriculum } from 'src/app/core/models/interfaces/curriculum';
import { Knowledge } from 'src/app/core/models/interfaces/knowledge';
import { Skill } from 'src/app/core/models/interfaces/skill';
import { CurriculumService } from 'src/app/curriculum/curriculum.service';
import { HeaderService } from 'src/app/shared/header/header.service';
import { TokenService } from '../../login/token.service';
import { UsersFormModalService } from '../../users/modals/users-form-modal.service';
import { SkillsService } from './skills.service';

@Component({
  selector: 'private-skill',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
})
export class SkillsComponent {
  displayedSkillsColumns: string[] = ['nombre', 'delete'];
  displayedKnowledgeColumns: string[] = [
    'nombre',
    'nivel',
    'habilidad',
    'delete',
  ];

  displayedColumnsSmallScreens: string[] = ['info', 'actions'];

  formPersonalSkillsGroup: FormGroup;
  formKnowledgeGroup: FormGroup;
  formKnowledgeGroupsGroup: FormGroup;
  chargeKnowledgesCompleted = false;
  chargeSkillsCompleted = false;

  nameFocusField: string;
  isSmallScreen = false;

  user: any;
  showExampleChart = false;
  idCurriculum: string;
  curriculum: Curriculum;

  knowledgeGroups: Skill[] = [];
  personalSkills: Skill[] = [];
  knowledges: Knowledge[] = [];

  personalSkillToAdd: Skill;
  knowledgeGroupToAdd: Skill;
  knowledgeToAdd: any;

  lengthForm: any;
  errorMsg: string;
  spinnerOn = false;
  constructor(
    private fb: FormBuilder,
    private headerService: HeaderService,
    private activatedRoute: ActivatedRoute,
    private curriculumService: CurriculumService,
    private skillService: SkillsService,
    private tokenService: TokenService,
    private usersFormModalService: UsersFormModalService,
    private breakpointObserver: BreakpointObserver,
    private router: Router
  ) {
    this.formPersonalSkillsGroup = fb.group({});
    this.formKnowledgeGroup = fb.group({});
    this.formKnowledgeGroupsGroup = fb.group({});
  }

  async ngOnInit() {
    //Nos suscribimos a breackpointobserver para escuchar cuando cambia el tamaño de la pantalla y cambiar el flag cuando se pasa el límite de 500px
    this.breakpointObserver
      .observe(['(max-width: 500px)'])
      .subscribe((state) => (this.isSmallScreen = state.matches));

    /*A través del servicio activatedRoute, llamo al servicio headerService, el cual está a la escucha del segmento de url que se le pasa como string.
    Eso hará que desde la cabecera podamos suscribirnos a dicho servicio y saber en que url estamos en cada momento.*/
    this.lengthForm = {
      skillNombre: MAX_LENGTH.LENGTH_20,
      knowledgeNombre: MAX_LENGTH.LENGTH_15,
    };

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

          this.skillService
            .getSkills(this.idCurriculum)
            .subscribe(async (skills) => {
              this.knowledgeGroups = skills.filter((skill: Skill) =>
                Boolean(Number(skill.habilidadUnica) == 0)
              );
              this.personalSkills = skills.filter((skill: Skill) =>
                Boolean(Number(skill.habilidadUnica) == 1)
              );
              this.chargeSkillsCompleted = true;
              this.getKnowledges();
            });

          this.resetPersonalSkill();
          this.resetKnowledgeGroup();
          this.resetKnowledge();
          this.setValidators();
        }
      });
  }

  resetKnowledgeGroup() {
    this.knowledgeGroupToAdd = {
      idHabilidad: '',
      idCurriculum: this.idCurriculum,
      nombre: '',
      nivel: 0,
      habilidadUnica: false,
    };
  }
  resetPersonalSkill() {
    this.personalSkillToAdd = {
      idHabilidad: '',
      idCurriculum: this.idCurriculum,
      nombre: '',
      nivel: 0,
      habilidadUnica: true,
    };
  }

  resetKnowledge() {
    this.knowledgeToAdd = {
      idConocimiento: '',
      idHabilidad: '',
      nombre: '',
      nivel: 0,
    };
  }

  onShowExampleChartClick() {
    this.showExampleChart = !this.showExampleChart;
  }

  setValidators() {
    //VALIDADORES DE PERSONAL SKILLS
    this.formPersonalSkillsGroup = this.fb.group(this.personalSkillToAdd);
    this.formPersonalSkillsGroup
      .get('nombre')
      ?.setValidators([
        Validators.required,
        Validators.maxLength(this.lengthForm.skillNombre),
      ]);
    this.formPersonalSkillsGroup
      .get('idCurriculum')
      ?.setValidators(Validators.required);

    //VALIDADORES DE GRUPO DE CONOCIMIENTOS
    this.formKnowledgeGroupsGroup = this.fb.group(this.knowledgeGroupToAdd);
    this.formKnowledgeGroupsGroup
      .get('nombre')
      ?.setValidators([
        Validators.required,
        Validators.maxLength(this.lengthForm.skillNombre),
      ]);
    this.formKnowledgeGroupsGroup
      .get('idCurriculum')
      ?.setValidators(Validators.required);

    //VALIDADORES DE CONOCIMIENTOS
    this.formKnowledgeGroup = this.fb.group(this.knowledgeToAdd);
    this.formKnowledgeGroup
      .get('nombre')
      ?.setValidators([
        Validators.required,
        Validators.maxLength(this.lengthForm.knowledgeNombre),
      ]);
    this.formKnowledgeGroup
      .get('nivel')
      ?.setValidators([Validators.max(10), Validators.min(0)]);
    this.formKnowledgeGroup
      .get('idHabilidad')
      ?.setValidators(Validators.required);
  }

  onDeleteSkillClick(skill: any) {
    this.skillService.deleteSkill(skill).subscribe(
      (resp) => {
        if (resp.status && resp.status === 'ok' && resp.result != -1) {
          this.usersFormModalService.openModal(
            true,
            'Habilidad eliminada correctamente.'
          );

          this.getSkills();
        } else {
          this.usersFormModalService.openModal(
            false,
            'No se ha podido eliminar la habilidad'
          );
        }
        this.spinnerOn = false;
      },
      () => {
        this.usersFormModalService.openModal(
          false,
          'Ha ocurrido un error inesperado, por favor, vuelve a intentarlo más tarde.'
        );

        this.spinnerOn = false;
      }
    );
  }

  onDeleteKnowledgeGroupClick(knowledgeGroup: any) {
    this.skillService.deleteSkill(knowledgeGroup).subscribe(
      (resp) => {
        if (resp.status && resp.status === 'ok' && resp.result != -1) {
          this.usersFormModalService.openModal(
            true,
            'Grupo de conocimientos eliminado correctamente.'
          );

          this.getSkills();
        } else {
          this.usersFormModalService.openModal(
            false,
            'No se ha podido eliminar el grupo de conocimientos. Comprueba que no tiene conocimientos asignados y vuelve a intentarlo.'
          );
        }
        this.spinnerOn = false;
      },
      () => {
        this.usersFormModalService.openModal(
          false,
          'No se ha podido eliminar el grupo de conocimientos. Comprueba que no tiene conocimientos asignados y vuelve a intentarlo.'
        );

        this.spinnerOn = false;
      }
    );
  }

  onDeleteKnowledgeClick(knowledge: any) {
    this.skillService.deleteKnowledge(knowledge).subscribe(
      (resp) => {
        if (resp.status && resp.status === 'ok' && resp.result != -1) {
          this.usersFormModalService.openModal(
            true,
            'Conocimiento eliminado correctamente.'
          );
          this.getKnowledges();
        } else {
          this.usersFormModalService.openModal(
            false,
            'No se ha podido eliminar este conocimiento, inténtalo más tarde.'
          );
        }
        this.spinnerOn = false;
      },
      () => {
        this.usersFormModalService.openModal(
          false,
          'No se ha podido eliminar este conocimiento, inténtalo más tarde.'
        );
        this.spinnerOn = false;
      }
    );
  }

  getSkills() {
    this.skillService.getSkills(this.idCurriculum).subscribe((skills) => {
      this.knowledgeGroups = skills.filter((skill: Skill) =>
        Boolean(Number(skill.habilidadUnica) == 0)
      );
      this.personalSkills = skills.filter((skill: Skill) =>
        Boolean(Number(skill.habilidadUnica) == 1)
      );
    });
  }

  async getKnowledges() {
    //Al ser una petición por cada habilidad, convierto el observable en promesa para recoger todos los valores antes de continuar
    let knowledgesCollection: any[] = [];

    knowledgesCollection = await Promise.all(
      this.knowledgeGroups.map(async (skillData) => {
        if (skillData.idHabilidad) {
          return this.skillService
            .getKnowledges(skillData.idHabilidad)
            .toPromise();
        }
        return [];
      })
    );

    this.chargeKnowledgesCompleted = true;
    this.knowledges = [].concat(...knowledgesCollection);
  }

  onSubmitPersonalSkill() {
    this.spinnerOn = true;

    this.personalSkillToAdd = {
      ...this.formPersonalSkillsGroup.value,
    };

    this.createSubmit(this.personalSkillToAdd);

  }


  onSubmitKnowledgeGroup() {
    this.spinnerOn = true;

    this.knowledgeGroupToAdd = {
      ...this.formKnowledgeGroupsGroup.value,
    };

    this.createSubmit(this.knowledgeGroupToAdd);
  }

  createSubmit(data:Skill){
    this.skillService.createSkill(data).subscribe(
      (resp) => {
        if (resp.status && resp.status === 'ok') {
          this.usersFormModalService.openModal(
            true,
            'Habilidad añadida correctamente.'
          );

          this.getSkills();
          this.resetPersonalSkill();
          this.setValidators();
        }
        this.spinnerOn = false;
      },
      () => {
        this.usersFormModalService.openModal(
          false,
          'Ha ocurrido un error inesperado, por favor, vuelve a intentarlo más tarde.'
        );

        this.spinnerOn = false;
      }
    );
  }

  onSubmitKnowledge() {
    this.spinnerOn = true;

    this.knowledgeToAdd = {
      ...this.formKnowledgeGroup.value,
    };

    this.skillService.createKnowledge(this.knowledgeToAdd).subscribe(
      (resp) => {
        if (resp.status && resp.status === 'ok') {
          this.usersFormModalService.openModal(
            true,
            'Conocimiento añadido correctamente.'
          );

          this.getKnowledges();
          this.resetKnowledge();
          this.setValidators();
        }
        this.spinnerOn = false;
      },
      () => {
        this.usersFormModalService.openModal(
          true,
          'Ha ocurrido un error inesperado, por favor, vuelve a intentarlo más tarde.'
        );

        this.spinnerOn = false;
      }
    );
  }

  resetPersonalSkillForm() {
    this.formPersonalSkillsGroup = this.fb.group(this.personalSkillToAdd);
    this.setValidators();
  }

  resetKnowledgeGroupForm() {
    this.formKnowledgeGroupsGroup = this.fb.group(this.knowledgeGroupToAdd);
    this.setValidators();
  }

  resetKnowledgeForm() {
    this.formKnowledgeGroup = this.fb.group(this.knowledgeToAdd);
    this.setValidators();
  }

  goToCurriculum() {
    const url = this.router.createUrlTree(['/', this.curriculum.alias]);
    window.open(url.toString(), '_blank');
  }
}
