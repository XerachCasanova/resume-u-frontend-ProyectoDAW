export interface Usuario {
  idUsuario?: number;
  nombre: string;
  apellidos: string;
  dni: string;
  fechaNacimiento: string;
  direccion: string;
  provincia: string;
  localidad: string;
  cp: string;
  telefono1?: string;
  telefono2?: string;
  email: string;
  password?: string;
  idCurriculum?: number;
  idRol?: number;
}
