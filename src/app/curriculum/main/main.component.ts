import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Curriculum } from 'src/app/core/models/interfaces/curriculum';
import { User } from 'src/app/core/models/interfaces/user';
import { UsersService } from 'src/app/modules/users/users.service';
import { CurriculumService } from '../curriculum.service';

@Component({
  selector: 'curriculum-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  user: User;
  curriculum: Curriculum;

  constructor(
    private usersService: UsersService,
    private curriculumService: CurriculumService,
    private activateRoute: ActivatedRoute
  ) {}

  async ngOnInit() {

    this.activateRoute.params.subscribe(async (params) => {
      const alias = params.alias;
      this.curriculumService.getCurriculumByAlias(alias).subscribe(async curriculums => {
        this.curriculum = curriculums[0];

        if (this.curriculum) {
          this.usersService.getUser(
            this.curriculum.idUsuario
          ).subscribe(user => {
            this.user = user[0];

            this.curriculumService.changeCurriculum(this.curriculum);
          });

        }
      });

    });
  }
}
