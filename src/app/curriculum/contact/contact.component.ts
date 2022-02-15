import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  constructor(private fb: FormBuilder) {
    this.formContactGroup = fb.group({});

    this.resetContact();
  }

  ngOnInit(): void {
    this.formContactGroup = this.fb.group(this.datosContacto);

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
