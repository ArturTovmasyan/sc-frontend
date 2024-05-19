import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class ResidentSelectorService {
  private _type: BehaviorSubject<number>;
  private _group: BehaviorSubject<number>;
  private _resident: BehaviorSubject<number>;

  constructor() {
    this._type = new BehaviorSubject(null);
    this._group = new BehaviorSubject(null);
    this._resident = new BehaviorSubject(null);
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
}
