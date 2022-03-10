import { Component } from '@angular/core';

@Component({
  selector: 'app-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.scss'],
})
export class PrivateComponent {
  menuActivado=false;
  constructor() {}

  activarMenu() {
    this.menuActivado = !this.menuActivado;
  }
}
