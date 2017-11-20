import { Component, OnInit } from '@angular/core';
import { LeaderboardService } from './../../leaderboard.service';

@Component({
  selector: 'app-logica',
  templateUrl: './logica.component.html',
  styleUrls: ['./logica.component.scss']
})
export class LogicaComponent implements OnInit {
  scores: GlobalScore = <GlobalScore>{};

  constructor(private leaderboardService: LeaderboardService) { }

  ngOnInit() {


    this.leaderboardService.getScores().subscribe((scores: GlobalScore) => {

      this.scores = scores;
    });


  }



}
