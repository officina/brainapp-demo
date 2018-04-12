import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../core/modules/shared.module';
import { RouterModule } from '@angular/router';

import { FuseProfileComponent } from './profile.component';
import { FuseProfileTimelineComponent } from './tabs/timeline/timeline.component';
import { ProfileService } from './profile.service';
import {UserService} from '../../../../components/user/user.service';

const routes = [
    {
        path     : 'profile',
        component: FuseProfileComponent,
        resolve  : {
            profile: ProfileService
        }
    }
];

@NgModule({
    declarations: [
        FuseProfileComponent,
        FuseProfileTimelineComponent,
    ],
    imports     : [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    providers   : [
        UserService,
        ProfileService
    ]
})
export class ProfileModule
{
}
