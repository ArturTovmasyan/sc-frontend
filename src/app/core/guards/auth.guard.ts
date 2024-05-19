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
          this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
          return false;
        } else {
          const expected_roles = route.data.roles || [];

          const user_info = JSON.parse(atob(localStorage.getItem('user')));
          if (user_info != null) {
            if (user_info.roles.every(v => expected_roles.indexOf(v) >= 0)) {
              return true;
            } else {
              this.router.navigate(['/404']);
              return false;
            }
          } else {
            return false;
          }
        }
      }));
  }
}
