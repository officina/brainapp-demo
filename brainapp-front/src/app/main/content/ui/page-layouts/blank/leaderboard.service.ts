import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
@Injectable()
export class LeaderboardService {

  constructor(public http:Http) {
    console.log('DATAA');
  }
  getScores(){
    return this.http.get('https://raw.githubusercontent.com/officina/brainapp/feature/apihook/brainapp-front/global.json?token=ATarJuCkQSNRSV8eOwI5q5qZMSmDUqqlks5aFps5wA%3D%3D')
      .map(res => res.json());
  }
}
