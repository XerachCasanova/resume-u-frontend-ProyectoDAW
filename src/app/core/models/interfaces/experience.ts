export interface Experience {
  idExperiencia?: string;
  empresa: string;
  cargo: string;
  logo?: string;
  descripcion: string;
  tareas: string;
  fechaComienzo: string;
  fechaFinalizacion: string | null;
  idCurriculum: string;
}
