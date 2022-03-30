import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ColorRange } from 'src/app/core/models/interfaces/colorRange';
import { CurriculumColorsService } from 'src/app/curriculum/curriculum-colors.service';
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
  @ViewChild('passwordCurriculum') passwordCurriculum:ElementRef

  spinnerOn = false;
  errorType: string;
  gamaColores: ColorRange;
  activationDoneMsg:string;
  userConfirmed = false;

  msgPasswordCurriculumWrong: string;

  constructor(private usersService:UsersService, private curriculumColorsService:CurriculumColorsService, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<usersFormModalComponent>) {

  }

  ngOnInit(): void {

    if(this.data.color) this.gamaColores = this.curriculumColorsService.buildColorRange(this.data.color);

  }

  onInputActivate($event:any){
    this.spinnerOn = true;
    this.usersService.activateUser($event.target.value, this.data.idUsuario).subscribe(resp => {
      if(resp) {
        this.activationDoneMsg ="¡Enhorabuena!, has activado tu cuenta de usuario. Vuelve a iniciar sesión y podrás acceder a tu configuración.";
        this.userConfirmed=true;
        this.spinnerOn = false;
      }

    })
  }

  onCurriculumPasswordClick(){
    console.log(this.data.passwordCurriculum)
    this.spinnerOn = true;
    this.msgPasswordCurriculumWrong = '';
    if(this.passwordCurriculum.nativeElement.value === this.data.passwordCurriculum){
      this.spinnerOn = false;
      this.dialogRef.close('ok');
    } else {
      this.spinnerOn = false;
      this.msgPasswordCurriculumWrong = 'Password incorrecto. Contacta con el candidato para que te proporcione una contraseña válida.'
    }
  }



}
