export interface User {
  idUsuario?: string;
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
  activo: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  idCurriculum?: string;
  idRol?: string;
}
