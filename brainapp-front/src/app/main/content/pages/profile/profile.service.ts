import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class ProfileService implements Resolve<any>
{
    timeline: any;
    about: any;
    photosVideos: any;

    timelineOnChanged: BehaviorSubject<any> = new BehaviorSubject({});
    aboutOnChanged: BehaviorSubject<any> = new BehaviorSubject({});
    photosVideosOnChanged: BehaviorSubject<any> = new BehaviorSubject({});

    constructor(private http: HttpClient, private translationService: TranslateService)
    {

    }

    /**
     * Resolve
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        return new Promise((resolve, reject) => {
            Promise.all([
                this.getTimeline(this.translationService.currentLang),
                this.getAbout(this.translationService.currentLang),
                this.getPhotosVideos(this.translationService.currentLang)
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get timeline
     */
    getTimeline(lang: string): Promise<any[]>
    {
        return new Promise((resolve, reject) => {

            this.http.get('api/profile-timeline-' + lang)
                .subscribe((timeline: any) => {
                    this.timeline = timeline;
                    this.timelineOnChanged.next(this.timeline);
                    resolve(this.timeline);
                }, reject);
        });
    }

    /**
     * Get about
     */
    getAbout(lang: string): Promise<any[]>
    {
        return new Promise((resolve, reject) => {

            this.http.get('api/profile-about-' + lang)
                .subscribe((about: any) => {
                    this.about = about;
                    this.aboutOnChanged.next(this.about);
                    resolve(this.about);
                }, reject);
        });
    }

    /**
     * Get photos & videos
     */
    getPhotosVideos(lang: string): Promise<any[]>
    {
        return new Promise((resolve, reject) => {

            this.http.get('api/profile-photos-videos-' + lang)
                .subscribe((photosVideos: any) => {
                    this.photosVideos = photosVideos;
                    this.photosVideosOnChanged.next(this.photosVideos);
                    resolve(this.photosVideos);
                }, reject);
        });
    }

}
