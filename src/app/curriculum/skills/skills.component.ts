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
import { Skill } from 'src/app/core/models/interfaces/skill';
import { CurriculumService } from '../curriculum.service';
import { of } from 'rxjs';
import { SkillsService } from 'src/app/modules/private/skills/skills.service';
import { FullSkill } from 'src/app/core/models/interfaces/fullSkill';
import { Knowledge } from 'src/app/core/models/interfaces/knowledge';

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

  skills: FullSkill[] = [];
  constructor(
    private skillsService: SkillsService,
    private curriculumService: CurriculumService
  ) {}

  async ngOnInit() {
    this.chartOptionsArray = new Array();

    this.curriculumService.currentCurriculum$.subscribe(async (curriculum) => {
      //El valor inicial del behaviorSubject es un curriculum sin datos, cuya id es = 0, se debe evitar una petición al back con ese curriculum.
      if (curriculum.idCurriculum && curriculum.idCurriculum != "0") {

        //Se llama al servicio que recibe las habilidades
        this.skillsService.getSkills(curriculum.idCurriculum).subscribe(async skills => {

          /*Cada habilidad hace una llamada al servidor para buscar los conocimientos asociados y se le asigna a cada elemento del array,
          al ser cada petición asíncrona, hay que convertirlas en promesas
          y utilizar Promise.all para recibir todas las peticiones antes de continuar.*/
          this.skills = await  Promise.all( skills.map(async ( skill:any) => {
            if (skill.idHabilidad) {
              skill.conocimientos = await this.skillsService.getKnowledges(skill.idHabilidad).toPromise();
              return skill;
            }
            else return [];
          }))

          /*Una vez construido el array, se eliminan las habilidades únicas, que no se mostrarán en esta pantalla, así como los elementos de cada objeto que no son necesarios*/
          this.skills = this.skills.filter((skill:any) => skill.habilidadUnica === "0").map(skill => {
            return {
              nombre: skill.nombre,
              conocimientos: skill.conocimientos
            } as FullSkill
          })
          this.buildCharts();
        });


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
          type: 'radar',
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
