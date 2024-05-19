import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {map, take} from 'rxjs/operators';
import {AuthenticationService} from '../services/auth.service';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  constructor(private auth$: AuthenticationService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.auth$.isLoggedIn.pipe(
      take(1),
      map((isLoggedIn: boolean) => {
        if (!isLoggedIn) {
          this.router.navigate(['/sign-in'], {queryParams: {returnUrl: state.url}});
          return false;
        } else {
          const expected_permissions = route.data.permissions || [];

          if (this.checkPermission(expected_permissions)) {
            return true;
          } else {
            this.router.navigate(['/404']);
            return false;
          }
        }
      }));
  }

  public checkPermission(expected_permissions: string[], level: number = 0): boolean {
    if (!expected_permissions || expected_permissions.length === 0) {
      return true;
    }

    const user_info = JSON.parse(atob(localStorage.getItem('user')));
    if (user_info != null) {
      const user_permissions = Object.keys(user_info.permissions);
      //  .filter(v => v !== 'persistence-security-user' && v !== 'persistence-security-role');

      // TODO: review level
      return expected_permissions.every(
        v => user_permissions.includes(v) && user_info.permissions[v].enabled
          && (user_info.permissions[v].hasOwnProperty('level') ? (user_info.permissions[v].level >= level) : true)
      );
    } else {
      return false;
    }
  }

  public gerUserId() {
    const user_info = JSON.parse(atob(localStorage.getItem('user')));
    if (user_info != null && user_info.hasOwnProperty('id')) {
      return user_info.id;
    }

    return null;
  }

}
