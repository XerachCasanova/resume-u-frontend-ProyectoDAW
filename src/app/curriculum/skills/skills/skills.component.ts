import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApexAxisChartSeries, ApexChart, ApexFill, ApexMarkers, ApexStroke, ApexTitleSubtitle, ApexXAxis, ApexYAxis, ChartComponent } from 'ng-apexcharts';


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
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit {
  @ViewChild("chart", { static: false }) chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions> | any;
  public chartOptionsArray: Partial<ChartOptions>[] | any;
  
  skills: any
  constructor() { 

    this.skills = environment.skills;

    this.chartOptionsArray = new Array();

    this.buildCharts();

  }

  ngOnInit(): void {

  }

  buildCharts(){
    
    
    for(let skill in this.skills){
      
      let skillData =  this.skills[skill];
      
      let levels = skillData.map((skill:any) => skill.level);
      let skillsName = skillData.map((skill:any) => skill.name);
      let colorsMarkers = new Array();
      let colorsXaxis = new Array();
      skillData.forEach((data:any) => {
        colorsMarkers.push('#26a69a');
        colorsXaxis.push('#696969');

      })
      
      this.chartOptionsArray.push({
        
        series: [
          {
            name: "Nivel",
            data: levels
          }
        ],
        chart: {
          width: '100%',
          height: '350',
          type: "radar",
          toolbar: {
            show: false
          }
        },
        title: {
          text: "» " + skill.charAt(0).toUpperCase() + skill.slice(1),

          style: {
            colors: ['#696969'],
            fontSize: '20px',
            fontWeight: '300',
            fontFamily: 'Roboto',
          
        }  
          
        },
        xaxis: {
          categories: skillsName,
          labels: {
            style: {
              colors: colorsXaxis,
              fontSize: '15px'
            }
          }
        },
        yaxis: {
          show: false,
        },
        fill: {
          opacity: 0.5,
          colors: ['#26a69a']
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['#26a69a'],
          dashArray: 0
        },
        markers: {
          size: 5,
          hover: {
            size: 10
          },
          colors: colorsMarkers
        },
        noData: {  
          text: "Cargando...",  
          align: 'center',  
          verticalAlign: 'middle',  
          offsetX: 0,  
          offsetY: 0,  
          style: {  
            color: "#000000",  
            fontSize: '14px',  
            fontFamily: "Roboto"  
          } 
        }
        
      })

    };
  }

}