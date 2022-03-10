import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Curriculum } from '../core/models/interfaces/curriculum';
import { User } from '../core/models/interfaces/user';
import usuariosJson from './mockedData/usuarios.json';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  constructor() {}

  async getUsuario(idUsuario: string): Promise<any> {
    const usuarios = usuariosJson as User[];
    return usuarios.find((usuario: User) => usuario.idUsuario === idUsuario);
  }
}
