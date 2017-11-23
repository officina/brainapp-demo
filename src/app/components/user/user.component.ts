import { Component, OnInit } from '@angular/core';
import { UserService } from "./user.service";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
user: ThisUser = <ThisUser>{}
  constructor(private userService: UserService) {}


  ngOnInit() {
    this.userService.getUsers('atomasse').subscribe((user: ThisUser) => {
      this.user = user;
    });
  }

}
