import { Component, OnInit } from '@angular/core';
import { LeaderboardService } from './../../leaderboard.service';

@Component({
  selector: 'app-problemsolving',
  templateUrl: './problemsolving.component.html',
  styleUrls: ['./problemsolving.component.scss']
})
export class ProblemsolvingComponent implements OnInit {
  scores: GlobalScore = <GlobalScore>{};

  constructor(private leaderboardService: LeaderboardService) { }

  ngOnInit() {


    this.leaderboardService.getScores('globale_creativita').subscribe((scores: GlobalScore) => {

      this.scores = scores;
    });


  }



}
