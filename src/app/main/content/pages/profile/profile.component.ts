import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '../../../../core/animations';
import { UserService} from '../../../../components/user/user.service';
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
    constructor(private userService: UserService)
    {

    }

    ngOnInit()
    {
      this.userService.getUsers('atomasse').subscribe((user: ThisUser) => {
        this.user = user;
      });
    }
}
