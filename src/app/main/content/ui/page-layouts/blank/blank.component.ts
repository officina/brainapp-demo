import { Component } from '@angular/core';
import { LeaderboardService } from './leaderboard.service';
import * as scores from 'scores';
@Component({
    selector   : 'fuse-blank',
    templateUrl: './blank.component.html',
    styleUrls  : ['./blank.component.scss']
})
export class FuseBlankComponent implements OnInit {
  score: GlobalScore;
  constructor(private leaderboardService: LeaderboardService) {}
    ngOnInit(){
      this.leaderboardService.getScores().subscribe((score: GlobalScore) => {
        this.score = score;
      });
    }
}
