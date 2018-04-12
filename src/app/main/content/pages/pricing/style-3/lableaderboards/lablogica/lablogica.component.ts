import { Component, OnInit } from '@angular/core';
import { LeaderboardService } from './../../../../../ui/page-layouts/blank/leaderboard.service';

@Component({
  selector: 'app-lablogica',
  templateUrl: './lablogica.component.html',
  styleUrls: ['./lablogica.component.scss']
})
export class LablogicaComponent implements OnInit {
  scores: GlobalScore = <GlobalScore>{};

  constructor(private leaderboardService: LeaderboardService) { }

  ngOnInit() {


    this.leaderboardService.getScores('tra_team_logica').subscribe((scores: GlobalScore) => {

      this.scores = scores;
    });


  }



}
