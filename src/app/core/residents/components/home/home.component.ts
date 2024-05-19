import {Component, OnInit} from '@angular/core';
import {simpleEmptyImage} from 'ng-zorro-antd';
import {DomSanitizer} from '@angular/platform-browser';
import {first} from 'rxjs/operators';
import {GroupType} from '../../models/group-type.enum';
import {AuthGuard} from '../../../guards/auth.guard';
import {ResidentAdmissionService} from '../../services/resident-admission.service';
import {Router} from '@angular/router';

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
    private residentAdmission$: ResidentAdmissionService,
    private router$: Router,
    private auth_$: AuthGuard
  ) {

  }

  ngOnInit(): void {
    this.residentAdmission$.list_active_first().pipe(first()).subscribe(res => {
      if (res) {
        this.data = res;
        // TODO: add region/apartment case
        if (this.data.facility.length === 1) {
          this.router$.navigate(['residents', GroupType.FACILITY, this.data.facility[0].id], { queryParams: {mode: true}} );
        }
      }
    });
  }

  addIfHasPermission(permission: string) {
    return this.auth_$.checkPermission([permission]);
  }
}
