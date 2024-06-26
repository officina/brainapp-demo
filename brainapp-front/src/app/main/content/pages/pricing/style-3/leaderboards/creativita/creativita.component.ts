import { Component, OnInit } from '@angular/core';
import { LeaderboardService } from './../../../../../ui/page-layouts/blank/leaderboard.service';

@Component({
  selector: 'app-creativita',
  templateUrl: './creativita.component.html',
  styleUrls: ['./creativita.component.scss']
})
export class CreativitaComponent implements OnInit {
  scores: GlobalScore = <GlobalScore>{};

  constructor(private leaderboardService: LeaderboardService) { }

  ngOnInit() {


    this.leaderboardService.getScores('globale_creativita').subscribe((scores: GlobalScore) => {

      this.scores = scores;
    });


  }



}
