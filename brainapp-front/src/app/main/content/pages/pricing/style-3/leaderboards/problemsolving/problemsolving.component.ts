import { Component, OnInit } from '@angular/core';
import { LeaderboardService } from './../../../../../ui/page-layouts/blank/leaderboard.service';

@Component({
  selector: 'app-problemsolving',
  templateUrl: './problemsolving.component.html',
  styleUrls: ['./problemsolving.component.scss']
})
export class ProblemsolvingComponent implements OnInit {
  scores: GlobalScore = <GlobalScore>{};

  constructor(private leaderboardService: LeaderboardService) { }

  ngOnInit() {


    this.leaderboardService.getScores().subscribe((scores: GlobalScore) => {

      this.scores = scores;
    });


  }



}
