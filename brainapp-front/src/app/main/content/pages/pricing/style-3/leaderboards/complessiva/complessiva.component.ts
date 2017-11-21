import { Component, OnInit } from '@angular/core';
import { LeaderboardService } from './../../../../../ui/page-layouts/blank/leaderboard.service';


@Component({
  selector: 'app-complessiva',
  templateUrl: './complessiva.component.html',
  styleUrls: ['./complessiva.component.scss']
})
export class ComplessivaComponent implements OnInit {
  scores: GlobalScore = <GlobalScore>{};

  constructor(private leaderboardService: LeaderboardService) { }

  ngOnInit() {


    this.leaderboardService.getScores('globale_punti').subscribe((scores: GlobalScore) => {

      this.scores = scores;
    });


  }



}
