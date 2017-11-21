import { Component, OnInit } from '@angular/core';
import { LeaderboardService } from './../../leaderboard.service';

@Component({
  selector: 'app-creativita',
  templateUrl: './creativita.component.html',
  styleUrls: ['./creativita.component.scss']
})
export class CreativitaComponent implements OnInit {
  scores: GlobalScore = <GlobalScore>{};

  constructor(private leaderboardService: LeaderboardService) { }

  ngOnInit() {


    this.leaderboardService.getScores("").subscribe((scores: GlobalScore) => {

      this.scores = scores;
    });


  }



}
