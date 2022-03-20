import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { User } from 'src/app/core/models/interfaces/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SkillsService {
  constructor(private http: HttpClient) {}

  getSkills(idCurriculum: string): Observable<any> {
    return this.http.get(
      environment.apiUrl+'habilidad?idCurriculum=' + idCurriculum
    );
  }

  getKnowledges(idHabilidad: string): Observable<any> {
    return this.http.get(
      environment.apiUrl+'conocimiento?idHabilidad=' + idHabilidad
    );
  }

  createSkill(skill: any): Observable<any> {
    return this.http.post(environment.apiUrl+'habilidad', skill);
  }

  createKnowledge(knowledge: any): Observable<any> {
    return this.http.post(
      environment.apiUrl+'conocimiento',
      knowledge
    );
  }

  deleteSkill(skill: any): Observable<any> {
    return this.http.delete(
      environment.apiUrl+'habilidad?idHabilidad=' +
        skill.idHabilidad
    );
  }

  deleteKnowledge(knowledge: any): Observable<any> {
    return this.http.delete(
      environment.apiUrl+'conocimiento?idConocimiento='+knowledge.idConocimiento);
  }
}
