import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  public subject = new Subject<string>();

  private urlSource = new BehaviorSubject('');
  private checkLoginSource = new BehaviorSubject(false);
  currentUrl$ = this.urlSource.asObservable();
  currentLogin$ = this.checkLoginSource.asObservable();

  constructor() {}

  changeUrl(url: string) {
    this.urlSource.next(url);
  }

  changeLoginState(isLogged: boolean) {
    this.checkLoginSource.next(isLogged);
  }
}
