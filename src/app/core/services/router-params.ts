import * as _ from 'lodash';
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Event as RouterEvent, NavigationEnd, Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {filter} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RouterParams {
  public params: BehaviorSubject<Array<any>>;
  public paramsSnapshot: Array<any>;

  private router: Router;

  // I initialize the router params service.
  constructor(router: Router) {
    this.router = router;

    this.paramsSnapshot = [];
    this.params = new BehaviorSubject(this.paramsSnapshot);

    // We will collection the params after every Router navigation event. However,
    // we're going to defer param aggregation until after the NavigationEnd event.
    // This should leave the Router in a predictable and steady state.
    // --
    // NOTE: Since the router events are already going to be triggering change-
    // detection, we probably don't have to take any precautions about whether or
    // not we subscribe to these events inside the Angular Zone.
    this.router.events
      .pipe(filter((event: RouterEvent): boolean => (event instanceof NavigationEnd)))
      .subscribe((event: NavigationEnd): void => {
        const snapshot = this.router.routerState.snapshot.root;
        const nextParams = this.collectParams(snapshot);

        // A Router navigation event can occur for a variety of reasons, such
        // as a change to the search-params. As such, we need to inspect the
        // params to see if the structure actually changed with this
        // navigation event. If not, we don't want to emit an event.
        if (!_.isEqual(this.paramsSnapshot, nextParams)) {
          this.params.next(this.paramsSnapshot = nextParams);
        }
      });
  }

  // ---
  // PRIVATE METHODS.
  // ---

  // I collect the params from the given router snapshot tree.
  // --
  // CAUTION: All params are merged into a single object. This means that like-named
  // params in different tree nodes will collide and overwrite each other.
  private collectParams(root: ActivatedRouteSnapshot): Array<any> {
    const params = [];

    this.mergeParamsFromSnapshot(params, root);

    return params.filter(v => !_.isEmpty(v.url) && !_.isEmpty(v.params));
  }

  private mergeParamsFromSnapshot(params: Array<any>, snapshot: ActivatedRouteSnapshot) {
    params.push({url: snapshot.url.map(v => v.path), params: snapshot.params});
    snapshot.children.forEach(v => this.mergeParamsFromSnapshot(params, v));
  }

}
