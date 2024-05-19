import * as normalize from 'normalize-path';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Route, Router} from '@angular/router';
import {DEFAULT_INTERRUPTSOURCES, Idle} from '@ng-idle/core';
import {Subscription, timer} from 'rxjs';
import {User} from '../../models/user';
import {AuthGuard} from '../../guards/auth.guard';
import {ProfileService} from '../../services/profile.service';
import {AuthenticationService} from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent implements OnInit, OnDestroy {
  public navItems = [];
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement = document.body;

  public user: User;

  public asideVisible: string | boolean = false;
  public licenseVisible: boolean = false;

  private $subscriptions: { [key: string]: Subscription; };

  constructor(
    private router: Router,
    private profile$: ProfileService,
    private auth_$: AuthGuard,
    private auth$: AuthenticationService,
    private idle$: Idle
  ) {
    this.$subscriptions = {};
    this.asideVisible = false;

    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = document.body.classList.contains('sidebar-minimized');
    });

    this.changes.observe(<Element>this.element, { attributes: true });
  }

  ngOnInit(): void {
    this.initIdle();

    this.subscribe('get_profile');

    this.generateNavigation(this.router.config[0]);
  }

  ngOnDestroy(): void {
    Object.keys(this.$subscriptions).forEach(key => this.$subscriptions[key].unsubscribe());
  }

  protected subscribe(key: string) {
    this.unsubscribe(key);
    switch (key) {
      case 'get_profile':
        this.$subscriptions[key] = this.profile$.me().subscribe(user => {
          this.user = user;

          this.licenseVisible = this.user && this.user.owner === true && this.user.license_accepted === false;
        });
        break;
    }
  }

  protected unsubscribe(key: string): void {
    if (this.$subscriptions.hasOwnProperty(key)) {
      this.$subscriptions[key].unsubscribe();
    }
  }

  private generateNavigation(route: Route) {
    const nav_tree: any = this.collectRoutes('', route, {}, false);
    const nav_flat: any[] = [
      {
        divider: true
      }
    ];

    // TODO: recurse if nested level > 2
    Object.keys(nav_tree).forEach(v => {
      if (nav_tree[v].length > 0) {
        const temp_flat = [];
        nav_tree[v].forEach(vv => {
          if (vv.hasOwnProperty('children')) {
            vv.children = vv.children.filter(vvv => vvv.hasOwnProperty('flat') && vvv.flat.length > 0);
            Object.keys(vv.children).forEach(vvv => vv.children[vvv] = vv.children[vvv].flat[0]);

            if (vv.children.length > 0) {
              temp_flat.push(vv);
            }
          } else {
            temp_flat.push(vv);
          }
        });

        if (temp_flat.length > 0) {
          nav_flat.push({
            title: true,
            name: v
          });
          nav_flat.push(...temp_flat);
        }
      }
    });

    this.navItems = nav_flat;
  }

  private collectRoutes(parent_path: string, route: Route, nav_tree: any, child_mode: boolean) {
    if (route.data && route.data.hasOwnProperty('nav') && route.data.nav.show === true) {
      const group_data: any = {
        url: normalize('/' + parent_path + '/' + route.path),
        name: route.data.nav.hasOwnProperty('title') ? route.data.nav.title : route.data.title,
        icon: 'icon-people'
      };

      if (route.children && route.children.length > 0) {
        const children = [];
        route.children.forEach(v => {
          const child_routes = this.collectRoutes(group_data.url, v, {}, true);
          if (child_routes) {
            children.push(child_routes);
          }
        });

        if (children.length > 0) {
          group_data.children = children;
        }
      }

      if (!child_mode) {
        if (route.data.nav.hasOwnProperty('group')) {
          const group = route.data.nav.group;

          if (!nav_tree.hasOwnProperty(group)) {
            nav_tree[group] = [];
          }

          if (this.auth_$.checkPermission(route.data.permissions)) {
            nav_tree[group].push(group_data);
          }
        }
      } else {
        if (!nav_tree.hasOwnProperty('flat')) {
          nav_tree['flat'] = [];
        }

        if (this.auth_$.checkPermission(route.data.permissions)) {
          nav_tree.flat.push(group_data);
        }
      }
    } else {
      if (route.children && route.children.length > 0) {
        route.children.forEach(v => this.collectRoutes(route.path, v, nav_tree, false));
      }
    }

    return nav_tree;
  }

  private initIdle() {
    this.idle$.setIdle(3600);
    this.idle$.setTimeout(60);
    this.idle$.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    this.idle$.onTimeout.subscribe(() => {
      this.auth$.sign_out();
      location.reload(true);
    });
    this.idle$.watch();
  }

  addIfHasPermission(permission: string) {
    return this.auth_$.checkPermission([permission]);
  }
}
