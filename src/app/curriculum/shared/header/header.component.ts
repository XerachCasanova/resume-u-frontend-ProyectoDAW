import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Skill } from 'src/app/core/models/interfaces/skill';
import { ContactComponent } from 'src/app/curriculum/contact/contact.component';
import { SkillsService } from 'src/app/modules/private/skills/skills.service';
import { environment } from 'src/environments/environment';
import { Curriculum } from '../../../core/models/interfaces/curriculum';
import { User } from '../../../core/models/interfaces/user';
import { CurriculumColorsService } from '../../curriculum-colors.service';
import { CurriculumHeaderService } from './curriculum-header.service';

@Component({
  selector: 'curriculum-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() user: User;
  @Input() curriculum: Curriculum;
  apiUrl = environment.apiUrl;
  activeMenuItem = "skills"
  menuActivado = false;
  gamaColores: any;
  isSmallScreen = false;
  isBurguerMenu = false;
  skills: Skill[] = [];

  activarMenu(route: string) {
    this.menuActivado = !this.menuActivado;
    this.curriculumHeaderService.changeUrl(route);
  }
  constructor(
    public contactDialog: MatDialog,
    private breakpointObserver:BreakpointObserver,
    private skillsService: SkillsService,
    private curriculumHeaderService: CurriculumHeaderService,
    private curriculumColorsService: CurriculumColorsService


  ) { }

  async ngOnInit() {

    this.curriculumHeaderService.changeUrl('skills');
    this.curriculumHeaderService.currentUrl$.subscribe((url) => {
      this.activeMenuItem = url;
    });


    //Nos suscribimos a breackpointobserver para escuchar cuando cambia el tamaño de la pantalla y cambiar el flag cuando se pasa el límite de 500px
    this.breakpointObserver.observe(['(max-width: 850px)']).subscribe((state) => this.isSmallScreen = state.matches);
    this.breakpointObserver.observe(['(max-width: 600px)']).subscribe((state) => this.isBurguerMenu = state.matches);
    if(this.curriculum && this.curriculum.idCurriculum) {
      this.gamaColores = this.curriculumColorsService.buildColorRange(this.curriculum.gamaColores);

      this.skillsService.getSkills(this.curriculum.idCurriculum).subscribe((skills: Skill[]) => {
        this.skills = skills.filter(skill => Number(Boolean(skill.habilidadUnica)) === 1);
      })
    }


  }

  onButtonClick(route: string){
    this.curriculumHeaderService.changeUrl(route);

  }

  openContactDialog() {
    this.activarMenu('');
    this.contactDialog.open(ContactComponent, {
      width: '800px',
    });
  }
}
