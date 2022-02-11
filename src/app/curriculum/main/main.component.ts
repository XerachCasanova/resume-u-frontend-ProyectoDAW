import { Component, OnDestroy, OnInit } from '@angular/core';
import { CurriculumService } from '../curriculum.service';

@Component({
  selector: 'curriculum-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  isInRoot = location.pathname === '/curriculum';
  constructor(private curriculumService: CurriculumService) {  }

  ngOnInit(): void {

    console.log(this.curriculumService.getCurriculum("XerachCasanovaCabrera-FullStackDeveloper"))
    
  }


}
