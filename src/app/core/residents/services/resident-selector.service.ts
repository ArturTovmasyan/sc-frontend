import * as _ from 'lodash';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {RouterParams} from '../../services/router-params';
import {ResidentState} from '../models/resident';
import {first} from 'rxjs/operators';
import {ResidentService} from './resident.service';

@Injectable({providedIn: 'root'})
export class ResidentSelectorService {
  private _type: BehaviorSubject<number>;
  private _group: BehaviorSubject<number>;
  private _resident: BehaviorSubject<number>;
  private _state: BehaviorSubject<ResidentState>;

  private param_subscription: Subscription;

  constructor(
    private router$: Router,
    private routerParams$: RouterParams,
    private resident$: ResidentService
  ) {
    this._type = new BehaviorSubject(null);
    this._group = new BehaviorSubject(null);
    this._resident = new BehaviorSubject(null);
    this._state = new BehaviorSubject(null);

    this.param_subscription = this.routerParams$.params.subscribe((params: Array<any>): void => {
      if (params) {
        params = params.filter(v => v.params.hasOwnProperty('id') && _.indexOf(v.url, 'resident') !== -1);

        if (params.length > 0) {
          const resident_id: number = +(params[0].params.id);

          if (resident_id !== this._resident.value) {
            this._resident.next(resident_id);
          }

          this.resident$.state(this._resident.value).pipe(first()).subscribe(res => {
            if (res) {
              this._state.next(res);
            }
          });
        } else {
          this._type.next(null);
          this._group.next(null);
          this._resident.next(null);
          this._state.next(null);
        }
      }
    });
  }

  get type(): BehaviorSubject<number> {
    return this._type;
  }

  get group(): BehaviorSubject<number> {
    return this._group;
  }

  get resident(): BehaviorSubject<number> {
    return this._resident;
  }

  get state(): BehaviorSubject<ResidentState> {
    return this._state;
  }
}
