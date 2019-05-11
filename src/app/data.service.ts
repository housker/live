import { Injectable } from '@angular/core';
import { Current, Update } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  getData(): Promise<Current> {
    return new Promise((resolve, reject) => {
      fetch('/data')
      .then(res => res.json())
      .then(jres => {
        resolve(jres);
      })
      .catch(err => console.log(err));
    })
  }

  getColors() {
    return [
      'rgba(255,99,132,1)',
      'rgba(54, 162, 235, 1)',
      'rgba(75, 192, 192, 1)',
    ]
  }
}
