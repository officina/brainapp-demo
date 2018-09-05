import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '../../../../core/animations';
import { UserService} from '../../../../components/user/user.service';
import { locale as english } from './i18n/en';
import { locale as italian } from './i18n/it';
import {FuseTranslationLoaderService} from '../../../../core/services/translation-loader.service';

@Component({
    selector     : 'fuse-profile',
    templateUrl  : './profile.component.html',
    styleUrls    : ['./profile.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class FuseProfileComponent implements OnInit
{
  user: ThisUser = <ThisUser>{};
    constructor(
      private userService: UserService,
      private translationLoader: FuseTranslationLoaderService,
    )
    {
      this.translationLoader.loadTranslations(english, italian);
    }

    ngOnInit()
    {
      this.userService.getUsers('atomasse').subscribe((user: ThisUser) => {
        this.user = user;
      });
    }
}
