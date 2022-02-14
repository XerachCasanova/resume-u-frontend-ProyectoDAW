import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Curriculum } from 'src/app/core/models/interfaces/curriculum';
import { Usuario } from 'src/app/core/models/interfaces/usuario';
import { CurriculumService } from '../curriculum.service';
import { UsuariosService } from '../usuarios.service';
@Component({
  selector: 'curriculum-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  usuario: Usuario;
  curriculum: Curriculum;

  constructor(private usuarioService:UsuariosService, private curriculumService: CurriculumService, private activateRoute: ActivatedRoute) {  }

  async ngOnInit() {

    this.activateRoute.params.subscribe(async params => {

      const alias = params.alias

      this.curriculum = await this.curriculumService.getCurriculum(alias);
      if(this.curriculum){
        this.usuario = await this.usuarioService.getUsuario(this.curriculum.idUsuario);
          this.curriculumService.changeCurriculum(this.curriculum);
      }



    })


  }

}
