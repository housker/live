import { Component, ViewChild, ElementRef } from '@angular/core';
import { DataService } from './data.service';
import io from 'socket.io-client';
import { Chart } from 'chart.js';
import { Current, Update } from '../../types';
 
const socket = io();

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('canvasEl') canvasEl: ElementRef;
  private context: CanvasRenderingContext2D;
  chart: any;
  title = 'Moving Time Series';
  current: Current;
  update: Update = {
    labels: { _id: undefined, date: undefined, label: undefined },
    values1: 1,
    values2:  2,
    values3: 3
  }
  colors = [];
  buttons = [];
  constructor(private dataService: DataService) {
    this.listen();
    this.dataService.getData()
    .then(data => {
      this.current = data;
      for(let key in data) {
        this.update[key] = data[key][data[key].length-1].value;
      }
      this.colors = this.dataService.getColors();
      this.populateButtons(this.colors);
      this.drawChart(data, this.colors);
    })
    .catch(err => console.log(err)) ;
  }

  listen() {
    socket.on('ping', (date) => {
      if(date && this.update) {
        let date1 = new Date(date);
        this.update.labels = { _id: undefined, date: date, label: date1.toLocaleTimeString('it-IT') };
        this.current.labels.push(this.update.labels);
        this.current.labels = this.current.labels.slice(1);
        for(let i = 1; i < 4; i++) {
          let key = `values${i}`
          let mostRecent = this.current[key];
          let latest = { _id: undefined, type: i, value: this.update[key], ts_id: undefined };
          this.current[key].push(latest);
          this.current[key] = this.current[key].slice(1);
        }
        this.drawChart(this.current, this.colors);
        socket.emit('data', this.update);
      }
    });
    socket.on('update', (data) => {
      if(data) {
        this.current = data;
      }
    });
  }

  populateButtons(colors) {
    for(let i = 1; i < 4; i++) {
      this.buttons.push([`Line${i}`, colors[i-1]])
    }
  }
  
  drawChart(data, colors) {
    if(this.chart) this.chart.destroy();
    const canvas = this.canvasEl.nativeElement;
    this.context = canvas.getContext( '2d' );
    this.chart  = new Chart(this.context, {
      type: 'line',
      data: {
        labels: data.labels.map(item => item.label),
        datasets: [
          {
            label: `Line${data.values1[0].type}`,
            data: data.values1.map(item => item.value),
            backgroundColor: colors[0],
            borderColor: colors[0],
            fill: false
          },
          {
            label: `Line${data.values2[0].type}`,
            data: data.values2.map(item => item.value),
            backgroundColor: colors[1],
            borderColor: colors[1],
            fill: false
          },
          {
            label: `Line${data.values3[0].type}`,
            data: data.values3.map(item => item.value),
            backgroundColor: colors[2],
            borderColor: colors[2],
            fill: false
          }
        ],
      },
      options: {
        animation: false,
        responsive: true,
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true
                  }
              }]
          }
      }
    });
  }

  increment(i, unit) {
    this.update[`values${i+1}`] = this.update[`values${i+1}`] += unit;
  }
  
}
