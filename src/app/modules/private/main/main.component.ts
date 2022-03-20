import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Curriculum } from 'src/app/core/models/interfaces/curriculum';
import { CurriculumService } from 'src/app/curriculum/curriculum.service';
import { TokenService } from '../../login/token.service';

@Component({
  selector: 'private-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {

  user: any
  curriculum: Curriculum[] = [];
  curriculumToAdd: Curriculum
  chargeCompleted = false;
  spinnerOn = false;
  constructor(private curriculumService:CurriculumService, private tokenService:TokenService, private router:Router) {}

  ngOnInit(){
    this.user = this.tokenService.getUser()

    this.curriculumService.getCurriculums(this.user.idUsuario).subscribe(curriculum => {
      this.curriculum = curriculum
      this.chargeCompleted = true;
      if(this.curriculum.length > 0){
        this.router.navigate(['private','configuration']);
      }
    } );

  }

  resetCurriculum(){
    this.curriculumToAdd = {
      acercaDe: '',
      alias: '',
      foto: '',
      gamaColores: '',
      idUsuario: this.user.idUsuario,
      profesion: '',
      web: '',
      tipoHabilidades: '',
      password: '',
      esPrivado: false,
    };
  }
  createCurriculum(){
    this.resetCurriculum();

    this.curriculumService.createCurriculum(this.curriculumToAdd).subscribe(() =>{
      this.spinnerOn = true;
      this.router.navigate(['private','configuration']);
    })
  }
}
