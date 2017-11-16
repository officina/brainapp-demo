import { Component } from '@angular/core';

@Component({
    selector   : 'fuse-blank',
    templateUrl: './blank.component.html',
    styleUrls  : ['./blank.component.scss']
})
export class FuseBlankComponent {
  score: GlobalScore;
  constructor(private leaderboardService: LeaderboardService) {}
    ngOnInit(){
      this.leaderboardService.getScores().subscribe((score: GlobalScore) => {
        this.score = score;
      });
    }
}
