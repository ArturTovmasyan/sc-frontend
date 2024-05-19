import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
    /**
     * @param {Router} router
     */
    constructor(private router: Router) {

    }

    /**
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {boolean}
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (localStorage.getItem('at')) {
            let searchPattern = new RegExp('^/admin', 'i');

            if (state.url == '/') {
                if (localStorage.getItem('admin') == 'false') {
                    this.router.navigate(['/dashboard']);
                } else {
                    this.router.navigate(['/admin']);
                }

                return false;
            }

            if (localStorage.getItem('admin') == 'false' && searchPattern.test(state.url)) {
                this.router.navigate(['/dashboard']);

                return false;
            }

            return true;
        } else {
            if (state.url !== '/') {
                this.router.navigate(['/login'], {queryParams: {to: state.url}});
            } else {
                this.router.navigate(['/login']);
            }
            return false;
        }
    }
}
