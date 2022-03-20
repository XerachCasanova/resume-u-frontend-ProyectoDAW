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
  displayedSkillsColumns: string[] = [
    'nombre',
    'nivel',
    'habilidadUnica',
    'delete',
  ];
  displayedKnowledgeColumns: string[] = [
    'nombre',
    'nivel',
    'habilidad',
    'delete',
  ];

  displayedColumnsSmallScreens: string[] = [
    'info',
    'actions',
  ];
  formSkillsGroup: FormGroup;
  formKnowledgeGroup: FormGroup;
  chargeKnowledgesCompleted = false;
  chargeSkillsCompleted = false;
  isSmallScreen = false;
  user: any;
  idCurriculum: string;
  curriculum: Curriculum;
  skills: Skill[] = [];
  uniqueSkills: Skill[] = [];
  skillToAdd: Skill;
  knowledges: Knowledge[] = [];
  knowledgeToAdd: any;
  showSkills = true;
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
    private usersFormModalService:UsersFormModalService,
    private breakpointObserver:BreakpointObserver,
    private router: Router,
  ) {
    this.formSkillsGroup = fb.group({});
    this.formKnowledgeGroup = fb.group({});
  }

  async ngOnInit() {
    //Nos suscribimos a breackpointobserver para escuchar cuando cambia el tamaño de la pantalla y cambiar el flag cuando se pasa el límite de 500px
    this.breakpointObserver.observe(['(max-width: 500px)']).subscribe((state) => this.isSmallScreen = state.matches);

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
              this.skills = skills;
              this.chargeSkillsCompleted = true;
              this.uniqueSkills = this.skills.filter(skill => Boolean(Number(skill.habilidadUnica)==0))
              this.getKnowledges();
            });

          this.resetSkill();
          this.resetKnowledge();
          this.setValidators();
        }
      });
  }

  onShowSkillsClick(){
    this.showSkills=!this.showSkills;
  }

  onUniqueSkillClick($event: any) {
    this.skillToAdd.habilidadUnica = $event.checked;
    if (this.skillToAdd.habilidadUnica == false) {
      this.skillToAdd.nivel = 0;
      this.formSkillsGroup.get('nivel')?.setValue(0);
    }
  }

  resetSkill() {
    this.skillToAdd = {
      idHabilidad: '',
      idCurriculum: this.idCurriculum,
      nombre: '',
      nivel: 0,
      habilidadUnica: false,
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

  setValidators(){
    this.formSkillsGroup = this.fb.group(this.skillToAdd);
    this.formSkillsGroup
      .get('nombre')
      ?.setValidators([
        Validators.required,
        Validators.maxLength(this.lengthForm.skillNombre),
      ]);
    this.formSkillsGroup
      .get('nivel')
      ?.setValidators([Validators.max(10), Validators.min(0)]);
    this.formSkillsGroup
      .get('idCurriculum')
      ?.setValidators(Validators.required);

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
          this.usersFormModalService.openModal(true, 'Habilidad eliminada correctamente.');

          this.getSkills();
        } else {
          this.usersFormModalService.openModal(false, 'No se ha podido eliminar la habilidad. Comprueba que no tiene conocimientos asignados y vuelve a intentarlo.');

        }
        this.spinnerOn = false;
      },
      () => {
        this.usersFormModalService.openModal(false, 'Ha ocurrido un error inesperado, por favor, vuelve a intentarlo más tarde.');

        this.spinnerOn = false;
      }
    );
  }

  onDeleteKnowledgeClick(knowledge: any) {
    this.skillService.deleteKnowledge(knowledge).subscribe(
      (resp) => {
        if (resp.status && resp.status === 'ok' && resp.result != -1) {
          this.usersFormModalService.openModal(true, 'Conocimiento eliminado correctamente.');
          this.getKnowledges();
        } else {
          this.usersFormModalService.openModal(false, 'No se ha podido eliminar este conocimiento, inténtalo más tarde.');
        }
        this.spinnerOn = false;
      },
      () => {
        this.usersFormModalService.openModal(false, 'No se ha podido eliminar este conocimiento, inténtalo más tarde.');
        this.spinnerOn = false;
      }
    );
  }

  getSkills() {
    this.skillService.getSkills(this.idCurriculum).subscribe((skills) => {
      this.skills = skills;
      this.uniqueSkills = this.skills.filter(skill => Boolean(Number(skill.habilidadUnica)==0))
    });


  }

  async getKnowledges() {
    //Al ser una petición por cada habilidad, convierto el observable en promesa para recoger todos los valores antes de continuar
    let knowledgesCollection: any[] = [];

    knowledgesCollection = await Promise.all(
      this.skills.map(async (skillData) => {
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

  onSubmitSkill() {
    this.spinnerOn = true;

    this.skillToAdd = {
      ...this.formSkillsGroup.value,
    };

    this.skillService.createSkill(this.skillToAdd).subscribe(
      (resp) => {
        if (resp.status && resp.status === 'ok') {
          this.usersFormModalService.openModal(true, 'Habilidad añadida correctamente.');

          this.getSkills();
          this.resetSkill();
          this.setValidators();
        }
        this.spinnerOn = false;
      },
      () => {
        this.usersFormModalService.openModal(false,  'Ha ocurrido un error inesperado, por favor, vuelve a intentarlo más tarde.');

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
          this.usersFormModalService.openModal(true,  'Conocimiento añadido correctamente.');

          this.getKnowledges();
          this.resetKnowledge();
          this.setValidators();
        }
        this.spinnerOn = false;
      },
      () => {
        this.usersFormModalService.openModal(true,  'Ha ocurrido un error inesperado, por favor, vuelve a intentarlo más tarde.');

        this.spinnerOn = false;
      }
    );
  }

  resetSkillForm() {

    this.formSkillsGroup = this.fb.group(this.skillToAdd);
    this.setValidators();
  }

  resetKnowledgeForm() {
    this.formKnowledgeGroup = this.fb.group(this.knowledgeToAdd);
    this.setValidators();
  }

  goToCurriculum(){
    this.router.navigate([this.curriculum.alias])
  }


}
