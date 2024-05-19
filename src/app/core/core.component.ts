import {Component} from '@angular/core';
import {navItems} from './_nav';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, map, mergeMap} from 'rxjs/operators';
import {TitleService} from './services/title.service';
import {TranslateService} from '@ngx-translate/core';
import { Spinkit } from 'ng-http-loader';

@Component({
  selector: 'body',
  template: `
    <router-outlet></router-outlet>
    <ng-http-loader [spinner]="spinkit.skWave"></ng-http-loader>
  `
})
export class CoreComponent {
  public spinkit = Spinkit;
  public navItems = navItems;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement = document.body;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private title$: TitleService,
    private translate$: TranslateService) {

    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = document.body.classList.contains('sidebar-minimized');
    });

    this.changes.observe(<Element>this.element, {
      attributes: true
    });

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd))
      .pipe(map(() => this.activatedRoute))
      .pipe(map((route) => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }))
      .pipe(filter((route) => route.outlet === 'primary' || route.outlet === 'resident-details' )) // TODO(haykg): review
      .pipe(mergeMap((route) => route.data))
      .subscribe((event) => this.title$.setTitle(event['title']));

    translate$.setDefaultLang('en');
    translate$.use('en');
  }
}
