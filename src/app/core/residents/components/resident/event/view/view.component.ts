import {Component, OnDestroy, OnInit} from '@angular/core';
import {ResidentEvent} from '../../../../models/resident-event';
import {simpleEmptyImage} from 'ng-zorro-antd';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  templateUrl: './view.component.html'
})
export class ViewComponent {
  defaultSvg = this.sanitizer.bypassSecurityTrustResourceUrl(simpleEmptyImage);

  private _event: ResidentEvent;

  set event(value: ResidentEvent) {
    this._event = value;
  }

  get event(): ResidentEvent {
    return this._event;
  }

  constructor(
    private sanitizer: DomSanitizer
  ) {
  }

}
