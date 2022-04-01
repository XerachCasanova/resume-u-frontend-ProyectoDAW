import { HttpClient } from '@angular/common/http';
import { Injectable, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Curriculum } from 'src/app/core/models/interfaces/curriculum';

import { usersFormModalComponent } from './users-form-modal.component';


@Injectable({
  providedIn: 'root',
})
export class UsersFormModalService {

  constructor(private usersFormDialog: MatDialog,){}

  openModal(respIsOk: boolean, msg:string){

    const objectModal = respIsOk ? this.okModalInfo(msg) : this.errorModalInfo(msg);
    return this.usersFormDialog.open(usersFormModalComponent, {...objectModal});
  }

  openPasswordCurriculumModal(curriculum: Curriculum){
    return this.usersFormDialog.open(usersFormModalComponent, {
      width: '800px',
      maxWidth: '80%',
      data: {
        header: 'advise',
        type: 'passwordCurriculum',
        passwordCurriculum: curriculum.password,
        color: curriculum.gamaColores,
        msg: 'El currículum al que estás intentando acceder está protegido con contraseña. Introdúcela para poder visualizarlo.',
      },
    });
  }


  openRecoveryPassword(msg:string){
    return this.usersFormDialog.open(usersFormModalComponent, {
      width: '800px',
      maxWidth: '80%',
      data: {
        header: 'advise',
        type: 'recoveryPassword',
        msg: msg,
      },
    });
  }

  openPasswordChange(email: string){
    return this.usersFormDialog.open(usersFormModalComponent, {
      width: '800px',
      maxWidth: '80%',
      data: {
        header: 'advise',
        type: 'recoveryPassword',
        email: email,
        recoveryPasswordStep: 2
      },
    });
  }

  openActivationCodeModal(idUsuario:string, msg: string){

    return this.usersFormDialog.open(usersFormModalComponent, {
      width: '800px',
      maxWidth: '80%',
      data: {
        header: 'advise',
        type: 'activationCode',
        idUsuario: idUsuario,
        msg: msg
      },
    })
  }


  private errorModalInfo(errorMsg: string) {
    return {
      maxWidth: '300px',
      data: {
        header: 'error',
        type: 'error',
        msg: errorMsg,
      },
    };
  }

  private okModalInfo(msg: string) {
    return {
      maxWidth: '300px',
      data: {
        header: 'info',
        type: 'ok',
        msg: msg,
      },
    };
  }

}
