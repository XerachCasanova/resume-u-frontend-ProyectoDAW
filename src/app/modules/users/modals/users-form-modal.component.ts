import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldAppearance, MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { usersService } from '../users.service';

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

  constructor(private usersService:usersService, @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  ngOnInit(): void {

  }

  onInputActivate($event:any){
    console.log(this.data)
    this.usersService.activateUser($event.target.value, this.data.idUsuario).subscribe(resp => {
      if(resp) {
        this.activationDoneMsg ="¡Enhorabuena!, has activado tu cuenta de usuario. Serás redirigido en 5 segundos.";
        this.userConfirmed=true;
      }

    })
  }


}
