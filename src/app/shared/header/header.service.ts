import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  public subject = new Subject<string>();

  private urlSource = new BehaviorSubject('');
  currentUrl$ = this.urlSource.asObservable();

  constructor() {}

  changeUrl(url: string) {
    this.urlSource.next(url);
  }
}
