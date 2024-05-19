import {Component, OnInit} from '@angular/core';
import {simpleEmptyImage} from 'ng-zorro-antd';
import {DomSanitizer} from '@angular/platform-browser';
import {HomeService} from '../../services/home.service';
import {first} from 'rxjs/operators';
import {GroupType} from '../../models/group-type.enum';

@Component({
  templateUrl: './home.component.html',
  providers: []
})
export class HomeComponent implements OnInit {
  GROUP_TYPE = GroupType;
  defaultSvg = this.sanitizer.bypassSecurityTrustResourceUrl(simpleEmptyImage);

  data: any;

  constructor(
    private sanitizer: DomSanitizer,
    private home$: HomeService
  ) {

  }

  ngOnInit(): void {
    this.home$.list().pipe(first()).subscribe(res => {
      if (res) {
        this.data = res;
      }
    });
  }

}
