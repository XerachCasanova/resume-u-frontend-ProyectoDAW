import { Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'generic-button',
  templateUrl: './generic-button.component.html',
  styleUrls: ['./generic-button.component.scss'],
})
export class GenericButtonComponent implements OnInit {

  @Input() mainColor: string = '#54bab9'
  @Input() darkColor: string = '#36807e'
  @Input() textButton: string;
  @Input() width: string;
  hoverButton = false;

  constructor() {}

  async ngOnInit() {

  }

  }

