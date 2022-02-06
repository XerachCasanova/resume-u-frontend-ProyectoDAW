import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'curriculum-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  isInRoot = location.pathname === '/curriculum';
  constructor() {  }

  ngOnInit(): void {

    
  }


}
