import {Component, OnDestroy, OnInit} from '@angular/core';
import {simpleEmptyImage} from 'ng-zorro-antd';
import {DomSanitizer} from '@angular/platform-browser';
import {FacilityEvent} from '../../../models/facility-event';

@Component({
  templateUrl: './view.component.html'
})
export class ViewComponent {
  defaultSvg = this.sanitizer.bypassSecurityTrustResourceUrl(simpleEmptyImage);

  private _event: FacilityEvent;

  set event(value: FacilityEvent) {
    this._event = value;
  }

  get event(): FacilityEvent {
    return this._event;
  }

  constructor(
    private sanitizer: DomSanitizer
  ) {
  }

}
