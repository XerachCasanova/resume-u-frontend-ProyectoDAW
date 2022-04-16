import { Component } from '@angular/core';
import { CurriculumService } from './curriculum.service';

@Component({
  selector: 'curriculum-root',
  templateUrl: './curriculum.component.html',
  styleUrls: ['./curriculum.component.scss'],
})
export class CurriculumComponent {
  title = 'Resume-U';

  constructor() {}
}
