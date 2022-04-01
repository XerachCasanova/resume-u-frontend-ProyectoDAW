import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PrivateService {
  public subject = new Subject<string>();

  private checkHasCurriculum = new BehaviorSubject(false);
  currentHasCurriculum$ = this.checkHasCurriculum.asObservable();

  constructor() {}


  changeHasCurriculumState(hasCurriculum: boolean) {
    this.checkHasCurriculum.next(hasCurriculum);
  }


}
