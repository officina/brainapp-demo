import { Component, OnInit } from '@angular/core';
import { LeaderboardService } from './../../../../../ui/page-layouts/blank/leaderboard.service';

@Component({
  selector: 'app-labcomplessiva',
  templateUrl: './labcomplessiva.component.html',
  styleUrls: ['./labcomplessiva.component.scss']
})
export class LabcomplessivaComponent implements OnInit {
  scores: GlobalScore = <GlobalScore>{};

  constructor(private leaderboardService: LeaderboardService) { }

  ngOnInit() {


    this.leaderboardService.getScores('team_punti').subscribe((scores: GlobalScore) => {

      this.scores = scores;
    });


  }



}
