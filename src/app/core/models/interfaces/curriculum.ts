export interface Curriculum {
  idCurriculum?: string;
  alias: string;
  foto: string;
  acercaDe: string;
  profesion: string;
  gamaColores: string;
  habilidadesUnicas?: any[];
  idiomas?: any[];
  datosInteres?: any[];
  password?:string;
  web?: string | null;
  idUsuario: string;
  esPrivado: boolean;
  tipoHabilidades: string,
}
