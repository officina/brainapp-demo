import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../profile.service';
import { fuseAnimations } from '../../../../../../core/animations';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector   : 'fuse-profile-timeline',
    templateUrl: './timeline.component.html',
    styleUrls  : ['./timeline.component.scss'],
    animations : fuseAnimations
})
export class FuseProfileTimelineComponent implements OnInit
{
    timeline: any;
    constructor(private translationService: TranslateService, private profileService: ProfileService)
    {
      translationService.onLangChange.subscribe(value => {
        this.profileService.getTimeline(value.lang);
      });
      this.profileService.timelineOnChanged.subscribe(timeline => {
        this.timeline = timeline;
      });
    }

    ngOnInit()
    {

    }
}
