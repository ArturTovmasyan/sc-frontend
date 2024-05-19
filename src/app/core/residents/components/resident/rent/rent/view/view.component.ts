import {Component, OnDestroy, OnInit} from '@angular/core';
import {simpleEmptyImage} from 'ng-zorro-antd';
import {DomSanitizer} from '@angular/platform-browser';
import {ResidentRent} from '../../../../../models/resident-rent';

@Component({
  templateUrl: './view.component.html'
})
export class ViewComponent {
  defaultSvg = this.sanitizer.bypassSecurityTrustResourceUrl(simpleEmptyImage);

  private _event: ResidentRent;

  set event(value: ResidentRent) {
    this._event = value;
  }

  get event(): ResidentRent {
    return this._event;
  }

  constructor(
    private sanitizer: DomSanitizer
  ) {
  }

}
