import { Component, OnInit } from '@angular/core';
import { LeaderboardService } from './../../../../../ui/page-layouts/blank/leaderboard.service';

@Component({
  selector: 'app-labcreativita',
  templateUrl: './labcreativita.component.html',
  styleUrls: ['./labcreativita.component.scss']
})
export class LabcreativitaComponent implements OnInit {
  scores: GlobalScore = <GlobalScore>{};

  constructor(private leaderboardService: LeaderboardService) { }

  ngOnInit() {


    this.leaderboardService.getScores('team_creativita').subscribe((scores: GlobalScore) => {

      this.scores = scores;
    });


  }



}
