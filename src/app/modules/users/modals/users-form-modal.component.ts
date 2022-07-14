import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
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
  @ViewChild('passwordCurriculum') passwordCurriculum: ElementRef;
  @ViewChild('recoveryPassword') recoveryPassword: ElementRef;

  spinnerOn = false;
  errorType: string;
  gamaColores: ColorRange;
  activationDoneMsg: string;
  userConfirmed = false;
  recoveryPasswordStep = 1;
  emailRecovery: string;
  formRecoveryPasswordGroup: FormGroup;

  msgError: string;

  constructor(
    private usersService: UsersService,
    private curriculumColorsService: CurriculumColorsService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<usersFormModalComponent>
  ) {}

  ngOnInit(): void {
    if(this.data.recoveryPasswordStep === 2) {

      this.recoveryPasswordStep = 2;
      this.emailRecovery = this.data.email;
      this.usersService.recoverPasswordSendEmail(this.emailRecovery).subscribe((resp) => {

      }, ()=> this.msgError =
      'Ha ocurrido un error inesperado, vuelve a intentarlo pasados unos minutos.')

    }
    if (this.data.color)
      this.gamaColores = this.curriculumColorsService.buildColorRange(
        this.data.color
      );
  }

  onInputActivate($event: any) {
    this.spinnerOn = true;
    this.usersService
      .activateUser($event.target.value, this.data.idUsuario)
      .subscribe((resp) => {
        if (resp) {
          this.activationDoneMsg =
            '¡Enhorabuena!, has activado tu cuenta de usuario. Vuelve a iniciar sesión y podrás acceder a tu configuración.';
          this.userConfirmed = true;
          this.spinnerOn = false;
        }
      });
  }

  onCurriculumPasswordClick() {
    this.spinnerOn = true;
    this.msgError = '';
    if (
      this.passwordCurriculum.nativeElement.value ===
      this.data.passwordCurriculum
    ) {
      this.spinnerOn = false;
      this.dialogRef.close('ok');
    } else {
      this.spinnerOn = false;
      this.msgError =
        'Password incorrecto. Contacta con el candidato para que te proporcione una contraseña válida.';
    }
  }

  onRecoveryPasswordClick() {

    this.spinnerOn = true;
    const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

    this.emailRecovery = this.recoveryPassword.nativeElement.value.trim();


    if ( this.emailRecovery != '' && emailRegex.test(this.emailRecovery)){

      this.usersService.checkEmail(this.emailRecovery).subscribe((resp) => {
          if(resp) {
            this.usersService.recoverPasswordSendEmail(this.emailRecovery).subscribe((resp) => {
              this.recoveryPasswordStep = 2;
            }, ()=> this.msgError =
            'Ha ocurrido un error inesperado, vuelve a intentarlo pasados unos minutos.')
          }
          else {
            this.msgError =
            'El e-mail introducido no pertenece a ningún usuario registrado.';
            this.recoveryPassword.nativeElement.value ='';
          }
      })

      this.spinnerOn = false;

    } else {
      this.spinnerOn = false;
      this.msgError =
        'Email incorrecto. Introduce un email válido.';
    }

   }

   onInputRecovery($event:any){
    this.usersService
      .checkRecoveryCode($event.target.value, this.emailRecovery)
      .subscribe((resp) => {
        if (resp) {
          this.formRecoveryPasswordGroup = this.fb.group({
            password: '',
            repeatPassword: '',
            email: this.emailRecovery,
            code: $event.target.value
          });

          this.formRecoveryPasswordGroup.get('password')?.setValidators(Validators.required);
          this.formRecoveryPasswordGroup.get('repeatPassword')?.setValidators(Validators.required)
          this.recoveryPasswordStep = 3;
          this.spinnerOn = false;
        }
      });
   }

   onSendNewPasswordClick(){

    const passwordToUpdate = this.formRecoveryPasswordGroup.value;
     this.usersService.resetPassword(passwordToUpdate).subscribe((resp) => {
      this.dialogRef.close('ok');
     }, () => {
       this.msgError='Ha habido un error. Vuele a intentarlo más tarde.'
       this.formRecoveryPasswordGroup.get('password')?.setValue('');
       this.formRecoveryPasswordGroup.get('repeatPassword')?.setValue('');
     })
   }
}
