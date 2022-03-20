import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsersService } from '../users.service';

export interface Contact {
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  asunto: string;
  mensaje: string;
}

export enum asunto {
  LABORAL = 'Asunto laboral',
  PERSONAL = 'Asunto personal',
}

@Component({
  selector: 'users-form-modal',
  templateUrl: './users-form-modal.component.html',
  styleUrls: ['./users-form-modal.component.scss'],
})
export class usersFormModalComponent implements OnInit {

  errorType: string;
  activationDoneMsg:string;
  userConfirmed = false;

  constructor(private usersService:UsersService, @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  ngOnInit(): void {

  }

  onInputActivate($event:any){
    this.usersService.activateUser($event.target.value, this.data.idUsuario).subscribe(resp => {
      if(resp) {
        this.activationDoneMsg ="¡Enhorabuena!, has activado tu cuenta de usuario. Vuelve a iniciar sesión y podrás acceder a tu configuración.";
        this.userConfirmed=true;
      }

    })
  }



}
