import {Component, OnDestroy, OnInit} from '@angular/core';
import {simpleEmptyImage} from 'ng-zorro-antd';
import {DomSanitizer} from '@angular/platform-browser';
import {first} from 'rxjs/operators';
import {GroupType} from '../../models/group-type.enum';
import {AuthGuard} from '../../../guards/auth.guard';
import {ResidentAdmissionService} from '../../services/resident-admission.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {Facility} from '../../models/facility';
import {FacilityService} from '../../services/facility.service';
import {ResidentSelectorService} from '../../services/resident-selector.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: []
})
export class HomeComponent implements OnInit, OnDestroy {
  GROUP_TYPE = GroupType;
  defaultSvg = this.sanitizer.bypassSecurityTrustResourceUrl(simpleEmptyImage);

  data: any;
  residents: any;
  facilities: Facility[];

  type: number;
  type_id: number;
  type_name: string;

  resident_id: number;

  sort_resident: boolean;
  sort_room: boolean;

  protected $subscriptions: { [key: string]: Subscription; };

  constructor(
    private sanitizer: DomSanitizer,
    private facility$: FacilityService,
    private residentAdmission$: ResidentAdmissionService,
    private residentSelector$: ResidentSelectorService,
    private router$: Router,
    private auth_$: AuthGuard
  ) {
    this.$subscriptions = {};

    this.sort_resident = null;
    this.sort_room = null;
  }

  ngOnInit(): void {
    this.subscribe('list_facility');
  }

  ngOnDestroy(): void {
    Object.keys(this.$subscriptions).forEach(key => this.$subscriptions[key].unsubscribe());
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'list_facility':
        this.$subscriptions[key] = this.facility$.all().pipe(first()).subscribe(res => {
          if (res) {
            res.sort((a, b) => a.id - b.id);
            this.facilities = res;

            if (this.facilities.length > 0) {
              this.select_facility(this.facilities[0].id, this.facilities[0].name);
            }
          }
        });
        break;
      case 'list_facility_residents':
        this.$subscriptions[key] = this.residentAdmission$
          .list_by_state('active', params.type, params.type_id)
          .pipe(first()).subscribe(res => {
            if (res) {
              this.residents = res;
            }
          });
        break;
      case 'list_active_first':
        const request_params: any = {type: params.type, type_id: params.type_id};

        if (this.sort_resident === true) {
          request_params['resident'] = 'ASC';
        } else if (this.sort_resident === false) {
          request_params['resident'] = 'DESC';
        }

        if (this.sort_room === true) {
          request_params['room'] = 'ASC';
        } else if (this.sort_room === false) {
          request_params['room'] = 'DESC';
        }

        this.$subscriptions[key] = this.residentAdmission$
          .list_active_first(request_params.type, request_params.type_id, request_params.resident, request_params.room)
          .pipe(first()).subscribe(res => {
            if (res) {
              this.data = res;
            }
          });
        break;
      default:
        break;
    }
  }

  protected unsubscribe(key: string): void {
    if (this.$subscriptions.hasOwnProperty(key)) {
      this.$subscriptions[key].unsubscribe();
    }
  }

  addIfHasPermission(permission: string) {
    return this.auth_$.checkPermission([permission]);
  }

  select_facility(id: number, name: string) {
    this.type_id = id;
    this.type_name = name;
    this.resident_id = null;

    this.subscribe('list_active_first', {type: GroupType.FACILITY, type_id: this.type_id});
    this.subscribe('list_facility_residents', {type: GroupType.FACILITY, type_id: this.type_id});
  }

  sort(sort_column: string) {
    switch (sort_column) {
      case 'resident':
        this.sort_resident = this.tristate(this.sort_resident);
        this.sort_room = null;
        break;
      case 'room':
        this.sort_resident = null;
        this.sort_room = this.tristate(this.sort_room);
        break;
    }

    this.subscribe('list_active_first', {type: GroupType.FACILITY, type_id: this.type_id});
  }

  tristate(state: boolean) {
    if (state === null) {
      return true;
    } else if (state === true) {
      return false;
    } else {
      return null;
    }
  }

  resident_changed() {
    if (this.resident_id !== null) {
      this.router$.navigate(
        ['/resident', this.resident_id, {outlets: {'primary': null, 'resident-details': ['responsible-persons']}}]
      );
    }
  }
}
