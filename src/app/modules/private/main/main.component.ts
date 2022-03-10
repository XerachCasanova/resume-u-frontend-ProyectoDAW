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
  curriculum: Curriculum[];
  constructor(private curriculumService:CurriculumService, private tokenService:TokenService, private router:Router) {}

  ngOnInit(){
    this.user = this.tokenService.getUser()

    this.curriculumService.getCurriculums(this.user.idUsuario).subscribe(curriculum => {
      this.curriculum = curriculum
      if(this.curriculum.length > 0){
        this.router.navigate(['private','user-data']);
      }
    } );

  }
}
