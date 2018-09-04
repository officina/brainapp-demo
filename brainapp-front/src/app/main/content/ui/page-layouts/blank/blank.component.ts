import { Component, OnInit } from '@angular/core';
import { LeaderboardService } from './leaderboard.service';
import { Observable } from 'rxjs/Observable';
import {now} from 'moment';
@Component({
    selector   : 'fuse-blank',
    templateUrl: './blank.component.html',
    styleUrls  : ['./blank.component.scss']
})
export class FuseBlankComponent implements OnInit {
  score: GlobalScore  = <GlobalScore>{};
  sub = null;
  matchUrl = 'https://brainappbackend.herokuapp.com/#/play/gameid/1001/playtoken/atomasse/sessionid/brainapp-ext';
  constructor(private leaderboardService: LeaderboardService) {}
    ngOnInit(){
      this.sub = Observable.interval(5000)
        .subscribe((val) => {
          // console.log('fresh');

          this.leaderboardService.getScores('globale_punti_make7').subscribe((score: GlobalScore) => {
            this.score = score;
          });
        });
    }
}
