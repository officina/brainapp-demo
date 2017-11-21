import { Component, OnInit } from '@angular/core';
import { LeaderboardService } from './../../../../../ui/page-layouts/blank/leaderboard.service';

@Component({
  selector: 'app-logica',
  templateUrl: './logica.component.html',
  styleUrls: ['./logica.component.scss']
})
export class LogicaComponent implements OnInit {
  scores: GlobalScore = <GlobalScore>{};

  constructor(private leaderboardService: LeaderboardService) { }

  ngOnInit() {


    this.leaderboardService.getScores('globale_logica').subscribe((scores: GlobalScore) => {

      this.scores = scores;
    });


  }



}
