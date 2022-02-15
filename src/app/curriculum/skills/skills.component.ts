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
import { SkillsService } from './skills.service';
import { Skill } from 'src/app/core/models/interfaces/skills';
import { CurriculumService } from '../curriculum.service';
import { of } from 'rxjs';

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
  public chartOptions: Partial<ChartOptions> | any;
  public chartOptionsArray: Partial<ChartOptions>[] | any;

  skills: Skill[];
  constructor(
    private skillsService: SkillsService,
    private curriculumService: CurriculumService
  ) {}

  async ngOnInit() {
    this.chartOptionsArray = new Array();

    this.curriculumService.currentCurriculum$.subscribe(async (curriculum) => {
      //El valor inicial del behaviorSubject es un curriculum sin datos, cuya id es = 0, se debe evitar una petición al back con ese curriculum.
      if (curriculum.idCurriculum != 0) {
        this.skills = await this.skillsService.getSkills(
          curriculum.idCurriculum
        );
        this.buildCharts();
      }
    });
  }

  buildCharts() {
    for (let skill in this.skills) {
      const skillData = this.skills[skill];
      const skillName = skillData.nombre;
      const knowledgeLevels = skillData.conocimientos.map(
        (conocimiento) => conocimiento.nivel
      );
      const knowledgeNames = skillData.conocimientos.map(
        (conocimiento) => conocimiento.nombre
      );

      let colorsMarkers = new Array();
      let colorsXaxis = new Array();
      this.skills.forEach(() => {
        colorsMarkers.push('#26a69a');
        colorsXaxis.push('#696969');
      });

      this.chartOptionsArray.push({
        series: [
          {
            name: 'Nivel',
            data: knowledgeLevels,
          },
        ],
        chart: {
          width: '100%',
          height: '350',
          type: 'bar',
          toolbar: {
            show: false,
          },
        },
        title: {
          text: '» ' + skillName.charAt(0).toUpperCase() + skillName.slice(1),

          style: {
            colors: ['#696969'],
            fontSize: '20px',
            fontWeight: '300',
            fontFamily: 'Roboto',
          },
        },
        xaxis: {
          categories: knowledgeNames,
          labels: {
            style: {
              colors: colorsXaxis,
              fontSize: '15px',
            },
          },
        },
        yaxis: {
          show: false,
        },
        fill: {
          opacity: 0.5,
          colors: ['#26a69a'],
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['#26a69a'],
          dashArray: 0,
        },
        markers: {
          size: 5,
          hover: {
            size: 10,
          },
          colors: colorsMarkers,
        },
        noData: {
          text: 'Cargando...',
          align: 'center',
          verticalAlign: 'middle',
          offsetX: 0,
          offsetY: 0,
          style: {
            color: '#000000',
            fontSize: '14px',
            fontFamily: 'Roboto',
          },
        },
      });
    }
  }
}
