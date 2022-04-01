import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ColorRange } from 'src/app/core/models/interfaces/colorRange';
import { UsersFormModalService } from 'src/app/modules/users/modals/users-form-modal.service';
import { provinciasService } from 'src/app/modules/users/provincias.service';
import { CurriculumColorsService } from '../curriculum-colors.service';
import { ContactService } from './contact.service';

export interface Contact {
  nombre: string;
  apellidos: string;
  email: string;
  emailUser: string;
  telefono: string;
  asunto: string;
  mensaje: string;
}

export enum asunto {
  LABORAL = 'Asunto laboral',
  PERSONAL = 'Asunto personal',
}

@Component({
  selector: 'curriculum-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  spinnerOn = false;
  formContactGroup: FormGroup;
  datosContacto!: Contact;
  asuntoContacto = Object.values(asunto);
  gamaColores: ColorRange;
  province: string ='';
  constructor(
    private fb: FormBuilder,
    private curriculumColorsService: CurriculumColorsService,
    private provincesService: provinciasService,
    private contactService: ContactService,
    private usersFormModalService: UsersFormModalService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ContactComponent>
  ) {
    this.formContactGroup = fb.group({});

    this.resetContact();
  }

  ngOnInit(): void {
    this.provincesService.getProvincia(this.data.user.cp.toString().substr(0,2)).subscribe(province =>  this.province = province[0].provincia);
    this.formContactGroup = this.fb.group(this.datosContacto);
    this.setValidators();
  }

  setValidators(){
    this.gamaColores = this.curriculumColorsService.buildColorRange(
      this.data.curriculum.gamaColores
    );
    this.formContactGroup.get('nombre')?.setValidators(Validators.required);
    this.formContactGroup.get('apellidos')?.setValidators(Validators.required);
    this.formContactGroup
      .get('email')
      ?.setValidators([Validators.required, Validators.email]);
    this.formContactGroup
      .get('telefono')
      ?.setValidators(Validators.pattern('[0-9]{9}'));
    this.formContactGroup.get('asunto')?.setValidators(Validators.required);
    this.formContactGroup.get('mensaje')?.setValidators(Validators.required);
  }
  resetContact() {
    this.datosContacto = {
      nombre: '',
      apellidos: '',
      email: '',
      emailUser: this.data.user.email,
      telefono: '',
      asunto: '',
      mensaje: '',
    };
  }

  onSubmit(){
    this.spinnerOn = true;
    this.datosContacto = this.formContactGroup.value
    this.contactService.sendMail(this.datosContacto).subscribe(() => {
      this.usersFormModalService.openModal(true, 'Mensaje enviado correctamente');
      this.resetContact();
      this.formContactGroup = this.fb.group(this.datosContacto);
      this.setValidators();
      this.spinnerOn =false;
    }, () => {
      this.usersFormModalService.openModal(false, 'Ha habido un error, inténtalo más tarde.');
      this.spinnerOn =false;
    })
  }
}
