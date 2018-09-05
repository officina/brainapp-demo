import { Component, OnInit } from '@angular/core';
import { LeaderboardService } from './leaderboard.service';
import { Observable } from 'rxjs/Observable';
import {FuseTranslationLoaderService} from '../../../../../core/services/translation-loader.service';
import {locale as italian} from '../../../pages/pricing/i18n/it';
import {locale as english} from '../../../pages/pricing/i18n/en';

@Component({
    selector   : 'fuse-blank',
    templateUrl: './blank.component.html',
    styleUrls  : ['./blank.component.scss']
})
export class FuseBlankComponent implements OnInit {
  score: GlobalScore  = <GlobalScore>{};
  sub = null;
  matchUrl = 'https://brainappbackend.herokuapp.com/#/play/gameid/1001/playtoken/atomasse/sessionid/brainapp-ext';
  constructor(private leaderboardService: LeaderboardService, private translationLoader: FuseTranslationLoaderService) {
    this.translationLoader.loadTranslations(english, italian);
  }
    ngOnInit(){
      this.sub = Observable.interval(5000)
        .subscribe((val) => {
          // console.log('fresh');

          this.leaderboardService.getScores('globale_punti_make7').subscribe((score: GlobalScore) => {
            this.score = score;
          });
        });
    }
}
