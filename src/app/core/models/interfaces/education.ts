export interface Education {
  idFormacion?: string;
  titulo: string;
  descripcion: string;
  centro: string;
  esTitulacionOficial: boolean;
  fechaComienzo: string;
  fechaFinalizacion: string | null;
  idCurriculum: string;
}
