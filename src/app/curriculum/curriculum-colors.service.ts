import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Curriculum } from '../core/models/interfaces/curriculum';

@Injectable({
  providedIn: 'root',
})
export class CurriculumColorsService {

  constructor() {}


  buildColorRange(color:string): any {

    let objectColors = {}
    switch(color){
      case 'Verde':
        objectColors = {
          mainColor: '#009688',
          chartsColor: '#26a69a',
          darkColor: '#0f423d',
          textColor: '#FFF',
        };
        break;
      case 'Azul':
        objectColors = {
          mainColor: '#5B7DB1',
          chartsColor: '#61A4BC',
          darkColor: '#1A132F',
          textColor: '#FFF',
        };
        break;
        case 'Rosa':
          objectColors = {
            mainColor: '#F582A7',
            chartsColor: '#F582A7',
            darkColor: '#F10086',
            textColor: '#FFF',
          };
        break;
        case 'Naranja':
          objectColors = {
            mainColor: '#FF9F45',
            chartsColor: '#FFBC80',
            darkColor: '#F76E11',
            textColor: '#FFF',
          };
        break;
    }

    return objectColors

  }



}