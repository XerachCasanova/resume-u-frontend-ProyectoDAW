import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ContactComponent } from 'src/app/curriculum/contact/contact.component';
import { Curriculum } from '../../../core/models/interfaces/curriculum';
import { Usuario } from '../../../core/models/interfaces/usuario';
import { CurriculumService } from '../../curriculum.service';
import { UsuariosService } from '../../usuarios.service';

@Component({
  selector: 'curriculum-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() usuario: Usuario
  @Input() curriculum: Curriculum;
  menuActivado = false;

  windowWidth = window.innerWidth;

  activarMenu(){
    this.menuActivado = !this.menuActivado;

  }
  constructor(public contactDialog:MatDialog, private curriculumService: CurriculumService, private usuarioService: UsuariosService, private router: Router) { }

  async ngOnInit() {

  }

  openContactDialog(){

    this.activarMenu();

    const contactDialogRef = this.contactDialog.open(ContactComponent, {width: '800px'})


  }

}
