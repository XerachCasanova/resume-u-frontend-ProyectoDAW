import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColorRange } from 'src/app/core/models/interfaces/colorRange';
import { Curriculum } from 'src/app/core/models/interfaces/curriculum';
import { User } from 'src/app/core/models/interfaces/user';
import { UsersFormModalService } from 'src/app/modules/users/modals/users-form-modal.service';
import { UsersService } from 'src/app/modules/users/users.service';
import { CurriculumColorsService } from '../curriculum-colors.service';
import { CurriculumService } from '../curriculum.service';

@Component({
  selector: 'curriculum-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  user: User;
  curriculum: Curriculum;
  passwordOk = false;
  gamaColores: ColorRange;
  hoverPrivateButton = false;

  constructor(
    private usersService: UsersService,
    private curriculumService: CurriculumService,
    private curriculumColorsService: CurriculumColorsService,
    private activateRoute: ActivatedRoute,
    private usersFormModalService: UsersFormModalService,
    private router: Router
  ) {}

  async ngOnInit() {

    this.activateRoute.params.subscribe(async (params) => {
      const alias = params.alias;
      this.curriculumService
        .getCurriculumByAlias(alias)
        .subscribe(async (curriculums) => {
          this.curriculum = curriculums[0];


          if (this.curriculum) {
            this.gamaColores = this.curriculumColorsService.buildColorRange(
              this.curriculum.gamaColores
            );
            this.openPrivateModalPassword();
            this.usersService
              .getUser(this.curriculum.idUsuario)
              .subscribe((user) => {
                this.user = user[0];

                this.curriculumService.changeCurriculum(this.curriculum);
              });
          } else {
            this.router.navigate(['/'])
          }
        });
    });
  }

  openPrivateModalPassword(){
    if (
      Boolean(Number(this.curriculum.esPrivado)) &&
      this.curriculum.password
    ) {
      const userModal =
        this.usersFormModalService.openPasswordCurriculumModal(
          this.curriculum
        );

      userModal.afterClosed().subscribe((resp) => {
        if (resp === 'ok') {
          this.passwordOk = true;
        }
      });
    } else {
      this.passwordOk = true;
    }
  }
}
