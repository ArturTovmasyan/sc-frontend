import {Component} from '@angular/core';
import {navItems} from './_nav';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, map, mergeMap} from 'rxjs/operators';
import {TitleService} from './services/title.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'body',
  template: `
    <router-outlet></router-outlet>`
})
export class CoreComponent {
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
      .pipe(filter((route) => route.outlet === 'primary'))
      .pipe(mergeMap((route) => route.data))
      .subscribe((event) => this.title$.setTitle(event['title']));

    translate$.setDefaultLang('en');
    translate$.use('en');
  }
}
