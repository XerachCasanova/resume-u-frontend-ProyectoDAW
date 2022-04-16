import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexFill,
  ApexMarkers,
  ApexStroke,
  ApexTitleSubtitle,
  ApexXAxis,
  ApexYAxis,
  ChartComponent,
} from 'ng-apexcharts';
import { CurriculumService } from '../curriculum.service';
import { FullSkill } from 'src/app/core/models/interfaces/fullSkill';
import { Curriculum } from 'src/app/core/models/interfaces/curriculum';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  title: ApexTitleSubtitle;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  fill: ApexFill;
  stroke: ApexStroke;
  markes: ApexMarkers;
};

@Component({
  selector: 'curriculum-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
})
export class SkillsComponent implements OnInit {
  @ViewChild('chart', { static: false }) chart!: ChartComponent;
  chartOptions: Partial<ChartOptions> | any;
  chartOptionsArray: Partial<ChartOptions>[] | any;
  gamaColores: string;
  curriculum: Curriculum;

  skills: FullSkill[] = [];
  constructor(
    private curriculumService: CurriculumService,
  ) {}

  async ngOnInit() {

    this.curriculumService.currentCurriculum$.subscribe(async (curriculum) => {
      //El valor inicial del behaviorSubject es un curriculum sin datos, cuya id es = 0, se debe evitar una petición al back con ese curriculum.
      if (curriculum.idCurriculum && curriculum.idCurriculum != "0") {

        this.curriculum = curriculum;
      }
    });
  }


}
