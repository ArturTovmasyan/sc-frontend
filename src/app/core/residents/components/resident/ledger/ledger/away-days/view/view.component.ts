import {Component} from '@angular/core';
import {simpleEmptyImage} from 'ng-zorro-antd';
import {DomSanitizer} from '@angular/platform-browser';
import {ResidentAwayDays} from '../../../../../../models/resident-away-days';

@Component({
  templateUrl: './view.component.html'
})
export class ViewComponent {
  defaultSvg = this.sanitizer.bypassSecurityTrustResourceUrl(simpleEmptyImage);

  private _event: ResidentAwayDays;

  set event(value: ResidentAwayDays) {
    this._event = value;
  }

  get event(): ResidentAwayDays {
    return this._event;
  }

  constructor(
    private sanitizer: DomSanitizer
  ) {
  }

}
