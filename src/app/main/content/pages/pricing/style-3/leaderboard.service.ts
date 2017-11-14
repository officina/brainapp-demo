// import { Injectable } from '@angular/core';
// import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
// import { Observable } from 'rxjs/Observable';
// import { HttpModule} from '@angular/http'
// import { HttpClient } from '@angular/common/http';
// import { BehaviorSubject } from 'rxjs/BehaviorSubject';
//
// @Injectable()
// export class LeaderboardService implements Resolve<any>
// {
//   leaderboard: any;
//
//   leaderboardOnChanged: BehaviorSubject<any> = new BehaviorSubject({});
//
//   constructor(private http: HttpClient) { }
//
//   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
//   {
//     return new Promise((resolve, reject) => {
//       Promise.all([
//         this.getLeaderboard()
//       ]).then(
//         () => {
//           resolve();
//         },
//         reject
//       );
//     });
//   }
//
//   getLeaderboard(): Promise<any[]>
//   {
//     return new Promise ((resolve, reject) => {
//       this.http.get('api/leaderboard-global')
//         .subscribe((leaderboard: any) => {
//           this.leaderboard = leaderboard;
//           this.leaderboardOnChanged.next(this.leaderboard);
//           resolve(this.leaderboard);
//         }, reject);
//     });
//   }
// }
