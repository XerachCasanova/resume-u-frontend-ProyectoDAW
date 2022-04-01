import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Curriculum } from 'src/app/core/models/interfaces/curriculum';
import { CurriculumService } from 'src/app/curriculum/curriculum.service';
import { HeaderService } from 'src/app/shared/header/header.service';
import { TokenService } from '../login/token.service';
import { UsersService } from '../users/users.service';
import { PrivateService } from './private.service';

@Component({
  selector: 'app-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.scss'],
})
export class PrivateComponent implements OnInit {
  menuActivado = false;
  curriculum: Curriculum;
  curriculumCreated = false;
  activeMenuItem = 'user-data';

  constructor(
    private curriculumService: CurriculumService,
    private usersService: UsersService,
    private privateService: PrivateService,
    private tokenService: TokenService,
    private router: Router,
    private headerService: HeaderService
  ) {}

  ngOnInit() {

    this.headerService.changeUrl(this.activeMenuItem);
    this.headerService.currentUrl$.subscribe(
      (url) => (this.activeMenuItem = url)
    );

    this.privateService.currentHasCurriculum$.subscribe((hasCurriculum => this.curriculumCreated = hasCurriculum))

    this.usersService
      .getUser(this.tokenService.getUser().idUsuario)
      .subscribe((userData) => {
        if (userData.length > 0 && userData[0].idUsuario) {
          this.curriculumService
            .getCurriculums(userData[0].idUsuario)
            .subscribe((curriculum) => {
              if (curriculum.length > 0) {
                this.curriculum = curriculum[0];
                this.curriculumCreated = true;
              } else {
                this.curriculumCreated = false;
                this.router.navigate(['private']);
              }
            });
        }
      });
  }

  activarMenu(route: string) {
    this.menuActivado = !this.menuActivado;
    this.headerService.changeUrl(route);
  }
}
