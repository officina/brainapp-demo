import { Component, OnInit } from '@angular/core';
import { LeaderboardService } from './../../leaderboard.service';

@Component({
  selector: 'app-complessiva',
  templateUrl: './complessiva.component.html',
  styleUrls: ['./complessiva.component.scss']
})
export class ComplessivaComponent implements OnInit {
  scores: GlobalScore = <GlobalScore>{};

  constructor(private leaderboardService: LeaderboardService) { }

  ngOnInit() {


    this.leaderboardService.getScores().subscribe((scores: GlobalScore) => {

      this.scores = scores;
    });


  }



}
