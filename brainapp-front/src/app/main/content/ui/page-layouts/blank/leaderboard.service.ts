import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';

@Injectable()
export class LeaderboardService {

  constructor(private http:Http) {
    // console.log('dato');
  }
  getScores(leaderboardId:string) {
    // console.log('dato');
      return this.http.get('http://localhost:8080/api/games/leaderboards/'+ leaderboardId +'?userid=atomasse')
      .map(res => res.json());

  }
}


