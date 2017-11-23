import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import 'rxjs/add/operator/map';
import {environment } from '../../../environments/environment';
@Injectable()
export class UserService {

  constructor(private http: Http) { }
  getUsers (userId:string) {
  return this.http.get(environment.apiUrl + 'users/po-profile/' + userId)
    .map(res => res.json());
  }
}
