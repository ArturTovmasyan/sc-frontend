import {Component} from '@angular/core';
import {simpleEmptyImage} from 'ng-zorro-antd';
import {DomSanitizer} from '@angular/platform-browser';
import {ResidentRentIncrease} from '../../../../../models/resident-rent-increase';

@Component({
  templateUrl: './view.component.html'
})
export class ViewComponent {
  defaultSvg = this.sanitizer.bypassSecurityTrustResourceUrl(simpleEmptyImage);

  private _event: ResidentRentIncrease;

  set event(value: ResidentRentIncrease) {
    this._event = value;
  }

  get event(): ResidentRentIncrease {
    return this._event;
  }

  constructor(
    private sanitizer: DomSanitizer
  ) {
  }

}
