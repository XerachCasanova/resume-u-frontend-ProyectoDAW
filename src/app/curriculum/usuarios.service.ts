import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Curriculum } from '../core/models/interfaces/curriculum';
import { Usuario } from '../core/models/interfaces/usuario';
import usuariosJson from './mockedData/usuarios.json';


@Injectable({
  providedIn: 'root'
})
export class UsuariosService {


  constructor() { }

  async getUsuario(idUsuario: number): Promise<any>{

    const usuarios = usuariosJson as Usuario[];
    return usuarios.find((usuario:Usuario) => usuario.idUsuario === idUsuario);


  }
}
