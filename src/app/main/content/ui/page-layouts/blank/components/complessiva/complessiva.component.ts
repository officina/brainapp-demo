import { Component, OnInit } from '@angular/core';
import { LeaderboardService } from './../../leaderboard.service';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-complessiva',
  templateUrl: './complessiva.component.html',
  styleUrls: ['./complessiva.component.scss']
})
export class ComplessivaComponent implements OnInit {
  scores: GlobalScore = <GlobalScore>{};
  sub = null;
  constructor(private leaderboardService: LeaderboardService) { }

  ngOnInit() {
    this.sub = Observable.interval(5000)
      .subscribe((val) => {
        // console.log('fresh');

        this.leaderboardService.getScores('globale_punti_make7').subscribe((scores: GlobalScore) => {
          this.scores = scores;
        });
      });
  }



}
