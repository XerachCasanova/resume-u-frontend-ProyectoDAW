import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';

import { User } from 'src/app/core/models/interfaces/user';
import { environment } from 'src/environments/environment';
import { usersFormModalComponent } from './users-form-modal.component';


@Injectable({
  providedIn: 'root',
})
export class UsersFormModalService {

  constructor(private usersFormDialog: MatDialog){}

  openModal(respIsOk: boolean, msg:string){

    const objectModal = respIsOk ? this.okModalInfo(msg) : this.errorModalInfo(msg);
    return this.usersFormDialog.open(usersFormModalComponent, {...objectModal});
  }

  openActivationCodeModal(idUsuario:string){

    return this.usersFormDialog.open(usersFormModalComponent, {
      maxWidth: '800px',
      data: {
        header: 'advise',
        type: 'activationCode',
        idUsuario: idUsuario,
        msg: 'Has sido dado de alta correctamente. Para poder empezar a disfrutar del servicio, debes introducir el código que hemos enviado a tu correo electrónico.',
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
