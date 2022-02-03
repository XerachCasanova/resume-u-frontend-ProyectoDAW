import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


export interface Contacto{
  nombre: string,
  apellidos: string,
  email: string,
  telefono: string,
  asunto: string,
  mensaje: string,
}

export enum asunto {

  LABORAL = 'Asunto laboral',
  PERSONAL = 'Asunto personal'
}

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements OnInit {
  
  formContactGroup: FormGroup;
  datosContacto!: Contacto;
  asuntoContacto = Object.values(asunto);

  constructor(private fb:FormBuilder) { 

    this.formContactGroup = fb.group({});

    this.resetContact();

    console.log(this.asuntoContacto);

  }

  ngOnInit(): void {

    this.formContactGroup = this.fb.group(this.datosContacto);

    this.formContactGroup.get('nombre')?.setValidators(Validators.required);
    this.formContactGroup.get('apellidos')?.setValidators(Validators.required);
    this.formContactGroup.get('email')?.setValidators([Validators.required, Validators.email]);
    this.formContactGroup.get('telefono')?.setValidators(Validators.pattern("[0-9]{9}"));
    this.formContactGroup.get('asunto')?.setValidators(Validators.required);
    this.formContactGroup.get('mensaje')?.setValidators(Validators.required);
  
  
  }

  resetContact(){

    this.datosContacto = {
      nombre: '',
      apellidos: '',
      email: '',
      telefono: '',
      asunto: '',
      mensaje: ''
    }

  }

}
