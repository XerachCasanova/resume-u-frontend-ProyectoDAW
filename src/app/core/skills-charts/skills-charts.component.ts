import { Component, Input, OnInit, ViewChild } from '@angular/core';
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

import { FullSkill } from 'src/app/core/models/interfaces/fullSkill';
import { CurriculumColorsService } from 'src/app/curriculum/curriculum-colors.service';
import { Curriculum } from '../models/interfaces/curriculum';
import { SkillsService } from 'src/app/modules/private/skills/skills.service';
import { ColorRange } from '../models/interfaces/colorRange';

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
  selector: 'skills-charts',
  templateUrl: './skills-charts.component.html',
  styleUrls: ['./skills-charts.component.scss'],
})
export class SkillsChartsComponent implements OnInit {
  @ViewChild('chart', { static: false }) chart!: ChartComponent;
  @Input() curriculum: Curriculum;
  @Input() example = false;

  skills: FullSkill[] = [];
  gamaColores: ColorRange;
  typeSkills = 'charts';
  typeChart = 'bar';
  chartOptions: Partial<ChartOptions> | any;
  chartOptionsArray: Partial<ChartOptions>[] | any;
  chargeCompleted = false;

  constructor(
    private skillsService: SkillsService,
    private curriculumColorsService: CurriculumColorsService
  ) {}

  async ngOnInit() {
    this.chartOptionsArray = new Array();

    //Si encuentra un curriculum, se montarán las habilidades a partir de lo que reciba, si no lo encuentra se montará sobre un ejemplo.
    if (this.curriculum && this.curriculum.idCurriculum && this.curriculum.idCurriculum != '0') {
      this.gamaColores = this.curriculumColorsService.buildColorRange(
        this.curriculum.gamaColores
      );
      //Se llama al servicio que recibe las habilidades
      this.skillsService
        .getSkills(this.curriculum.idCurriculum)
        .subscribe(async (skills) => {
          /*Cada habilidad hace una llamada al servidor para buscar los conocimientos asociados y se le asigna a cada elemento del array,
        al ser cada petición asíncrona, hay que convertirlas en promesas
        y utilizar Promise.all para recibir todas las peticiones antes de continuar.*/
          this.skills = await Promise.all(
            skills.map(async (skill: any) => {
              if (skill.idHabilidad) {
                skill.conocimientos = await this.skillsService
                  .getKnowledges(skill.idHabilidad)
                  .toPromise();
                return skill;
              } else return [];
            })
          );

          /*Una vez construido el array, se eliminan las habilidades únicas o especiales, que no se mostrarán en esta pantalla, así como los elementos de cada objeto que no son necesarios*/
          this.skills = this.skills
            .filter((skill: any) => skill.habilidadUnica === '0')
            .map((skill) => {
              return {
                nombre: skill.nombre,
                conocimientos: skill.conocimientos,
              } as FullSkill;
            });

          /*Si el tipo de muestreo recibido por el servidor es bar o radar, significa que las habilidades se montarán
          en forma de estadísticas con la librería ApexCharts*/

          if(this.curriculum.tipoHabilidades=='bar' || this.curriculum.tipoHabilidades == 'radar'){
            this.typeSkills = 'charts'
            this.buildCharts();
          }
          //En caso contrario se mostrarán de una manera normal: basic (con niveles), no-levels (sin niveles)
          else if (this.curriculum.tipoHabilidades=='basic') {
            this.typeSkills = 'basic';

          } else {
            this.typeSkills = 'no-levels'
          }

        });
    } else {
      this.buildCharts();
    }
  }

  buildCharts() {
    let skillData: FullSkill;
    //Se comprueba si el montaje de las skills va a ser sobre skills reales o una de ejemplo
    if (!this.example) {

      if(this.skills.length > 0) {
        for (let skill in this.skills) {
          skillData = this.skills[skill];
          this.buildSkills(skillData);
        }
      } else {
        this.chargeCompleted = true;
      }

    } else {

      //Skill de ejemplo.
      skillData = {
        nombre: 'Ofimática',
        conocimientos: [
          {
            idConocimiento: '1',
            nombre: 'Word',
            nivel: 9,
            habilidad: [],
          },
          {
            idConocimiento: '2',
            nombre: 'Excel',
            nivel: 8,
            habilidad: [],
          },
          {
            idConocimiento: '3',
            nombre: 'Access',
            nivel: 5,
            habilidad: [],
          },
          {
            idConocimiento: '4',
            nombre: 'PowerPoint',
            nivel: 8,
            habilidad: [],
          },
          {
            idConocimiento: '5',
            nombre: 'Outlook',
            nivel: 7,
            habilidad: [],
          },
        ],
      };

      //Se monta la skill de ejemplo en la variable skills para que se pueda renderizar y se llama al método que monta el apexchart
      this.skills=[skillData]
      this.buildSkills(skillData);
    }


  }

  buildSkills(skillData: FullSkill) {

    //Si existe la gama de colores del curriculum se le asignan los colores y si no, se le asigna el color genérico de la web.

    const color = this.gamaColores && this.gamaColores.chartsColor ? this.gamaColores.chartsColor : '#009688';

    //Se le asigna al tipo de muestreo el que viene del curriculum y si no, se le asigna el genérico (barras).

    this.typeChart = this.curriculum && this.curriculum.tipoHabilidades ? this.curriculum.tipoHabilidades :this.typeChart;

    /*Todo el código siguiente monta el array de estadísticas de la libería apexchart. Una gráfica por skill del array Skills */
    const skillName = skillData.nombre;
    const knowledgeLevels = skillData.conocimientos.map(
      (conocimiento) => conocimiento.nivel
    );
    const knowledgeNames = skillData.conocimientos.map(
      (conocimiento) => conocimiento.nombre
    );

    let colorsMarkers = new Array();
    let colorsXaxis = new Array();
    skillData.conocimientos.forEach(() => {
      colorsMarkers.push(color);
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
        type: this.typeChart,
        toolbar: {
          show: false,
        },
      },
      title: {
        text: '» ' + skillName.charAt(0).toUpperCase() + skillName.slice(1),

        style: {
          colors: ['color'],
          fontSize: '20px',
          fontWeight: '300',
          fontFamily: 'Roboto',
          fontColor: 'black'
        },
      },
      xaxis: {
        categories: knowledgeNames,
        labels: {
          style: {
            colors: colorsXaxis,
            fontSize: '12px',
          },
        },
      },
      yaxis: {
        show: false,
      },
      fill: {
        opacity: 0.5,
        colors: [color],
      },
      stroke: {
        show: true,
        width: 2,
        colors: [color],
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

  /*El muestreo de ejemplo trae un select para seleccionar las distintas vistas, ya sea en forma de gráfica o en forma básica. */
  exampleTypeChange($event:any){
    this.chartOptionsArray = new Array();


    if($event.value=='radar'){
      this.typeChart = 'radar';
      this.typeSkills = 'charts';
      this.buildCharts()
    }

    if($event.value=='bar'){
      this.typeChart = 'bar';
      this.typeSkills = 'charts';
      this.buildCharts()
    }

    if($event.value=='basic'){

      this.typeChart = 'basic';
      this.typeSkills = 'basic';
    }

    if($event.value=='no-levels'){

      this.typeChart = 'no-levels';
      this.typeSkills = 'no-levels';
    }

  }
}
