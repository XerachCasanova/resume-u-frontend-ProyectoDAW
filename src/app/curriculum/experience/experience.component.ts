import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

export interface Experience{

  dateStart: string,
  dateEnd: string,
  companyName: string,
  logo: string,
  position: string,
  positionDesc: string,
  tasks: string[]
}

@Component({
  selector: 'curriculum-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.css']
})
export class ExperienceComponent implements OnInit {

  experience: Experience[];
  constructor() {
    
    this.experience = environment.experience;
    

   }

  ngOnInit(): void {
  }

}
