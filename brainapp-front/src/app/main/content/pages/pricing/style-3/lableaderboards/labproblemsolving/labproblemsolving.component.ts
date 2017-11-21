import { Component, OnInit } from '@angular/core';
import { LeaderboardService } from './../../../../../ui/page-layouts/blank/leaderboard.service';

@Component({
  selector: 'app-labproblemsolving',
  templateUrl: './labproblemsolving.component.html',
  styleUrls: ['./labproblemsolving.component.scss']
})
export class LabproblemsolvingComponent implements OnInit {
  scores: GlobalScore = <GlobalScore>{};

  constructor(private leaderboardService: LeaderboardService) { }

  ngOnInit() {


    this.leaderboardService.getScores('team_problem_solving').subscribe((scores: GlobalScore) => {

      this.scores = scores;
    });


  }



}
