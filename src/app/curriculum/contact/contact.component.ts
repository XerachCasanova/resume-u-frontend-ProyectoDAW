import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ColorRange } from 'src/app/core/models/interfaces/colorRange';
import { Provincia } from 'src/app/core/models/interfaces/provincia';
import { provinciasService } from 'src/app/modules/users/provincias.service';
import { CurriculumColorsService } from '../curriculum-colors.service';

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
  selector: 'curriculum-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  formContactGroup: FormGroup;
  datosContacto!: Contact;
  asuntoContacto = Object.values(asunto);
  gamaColores: ColorRange;
  province: string ='';
  constructor(
    private fb: FormBuilder,
    private curriculumColorsService: CurriculumColorsService,
    private provincesService: provinciasService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ContactComponent>
  ) {
    this.formContactGroup = fb.group({});

    this.resetContact();
  }

  ngOnInit(): void {
    this.provincesService.getProvincia(this.data.user.cp.toString().substr(0,2)).subscribe(province =>  this.province = province[0].provincia);
    this.formContactGroup = this.fb.group(this.datosContacto);
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
      telefono: '',
      asunto: '',
      mensaje: '',
    };
  }
}
