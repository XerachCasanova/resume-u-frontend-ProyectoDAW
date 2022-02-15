import { Component } from '@angular/core';
import { CurriculumService } from './curriculum.service';

@Component({
  selector: 'curriculum-root',
  templateUrl: './curriculum.component.html',
  styleUrls: ['./curriculum.component.css'],
})
export class CurriculumComponent {
  title = 'curriculum-ang';

  constructor(private curriculumService: CurriculumService) {}
}
