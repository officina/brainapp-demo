import { Component } from '@angular/core';
import {FuseTranslationLoaderService} from '../../../../../core/services/translation-loader.service';
import { locale as english } from '../i18n/en';
import { locale as italian } from '../i18n/it';

@Component({
    selector   : 'fuse-pricing-style-3',
    templateUrl: './style-3.component.html',
    styleUrls  : ['./style-3.component.scss']
})
export class FusePricingStyle3Component
{
    constructor(
      private translationLoader: FuseTranslationLoaderService
    )
    {
      this.translationLoader.loadTranslations(english, italian);
    }

}
interface Leaderboard {
  global: [{total: number}];
}
