import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {simpleEmptyImage} from 'ng-zorro-antd';
import {Subscription} from 'rxjs';
import {first} from 'rxjs/operators';
import {AuthGuard} from '../../../guards/auth.guard';
import {FacilityService} from '../../services/facility.service';
import {ApartmentService} from '../../services/apartment.service';
import {RegionService} from '../../services/region.service';
import {ResidentAdmissionService} from '../../services/resident-admission.service';
import {GroupType} from '../../models/group-type.enum';
import {GroupHelper} from '../../helper/group-helper';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: []
})
export class HomeComponent implements OnInit, OnDestroy {
  defaultSvg = this.sanitizer.bypassSecurityTrustResourceUrl(simpleEmptyImage);
  GroupType = GroupType;

  data: any;

  options: { state?: string, type?: number, type_id?: number, sort_resident?: boolean, sort_room?: boolean } = {
    sort_resident: null,
    sort_room: null,
  };

  group_helper: GroupHelper;

  resident_id: number;
  residents: any;

  type_name: string;

  protected $subscriptions: { [key: string]: Subscription; };

  constructor(
    private sanitizer: DomSanitizer,
    private facility$: FacilityService,
    private apartment$: ApartmentService,
    private region$: RegionService,
    private residentAdmission$: ResidentAdmissionService,
    private router$: Router,
    private auth_$: AuthGuard
  ) {
    this.group_helper = new GroupHelper();

    this.$subscriptions = {};
  }

  ngOnInit(): void {
    this.subscribe('list_facility');
    this.subscribe('list_apartment');
    this.subscribe('list_region');
  }

  ngOnDestroy(): void {
    Object.keys(this.$subscriptions).forEach(key => this.$subscriptions[key].unsubscribe());
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'list_facility':
        this.$subscriptions[key] = this.facility$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.group_helper.facilities = res;
            this.group_helper.facilities.forEach((v, i) => {
              this.group_helper.facilities[i]['type'] = GroupType.FACILITY;
            });

            if (this.group_helper.facilities.length > 0) {
              this.select_group(GroupType.FACILITY, this.group_helper.facilities[0].id, this.group_helper.facilities[0].name);
            }
          }
        });
        break;
      case 'list_apartment':
        this.$subscriptions[key] = this.apartment$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.group_helper.apartments = res;
            this.group_helper.apartments.forEach((v, i) => {
              this.group_helper.apartments[i]['type'] = GroupType.APARTMENT;
            });
          }
        });
        break;
      case 'list_region':
        this.$subscriptions[key] = this.region$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.group_helper.regions = res;
            this.group_helper.regions.forEach((v, i) => {
              this.group_helper.regions[i]['type'] = GroupType.REGION;
            });
          }
        });
        break;
      case 'list_residents':
        const state = (this.options.state !== undefined && this.options.state !== null) ? this.options.state : 'active';
        this.$subscriptions[key] = this.residentAdmission$
          .list_by_state(state, params.type, params.type_id)
          .pipe(first()).subscribe(res => {
            if (res) {
              this.residents = res;
            }
          });
        break;
      case 'list_active_first':
        const request_params: any = {type: params.type, type_id: params.type_id};

        if (this.options.sort_resident === true) {
          request_params['resident'] = 'ASC';
        } else if (this.options.sort_resident === false) {
          request_params['resident'] = 'DESC';
        }

        if (this.options.sort_room === true) {
          request_params['room'] = 'ASC';
        } else if (this.options.sort_room === false) {
          request_params['room'] = 'DESC';
        }

        this.$subscriptions[key] = this.residentAdmission$
          .list_active_first(request_params.type, request_params.type_id, request_params.resident, request_params.room)
          .pipe(first()).subscribe(res => {
            if (res) {
              switch (request_params.type) {
                case GroupType.FACILITY:
                  this.data = res.facility;
                  break;
                case GroupType.APARTMENT:
                  this.data = res.apartment;
                  break;
                case GroupType.REGION:
                  this.data = res.region;
                  break;
              }
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

  sort(sort_column: string) {
    switch (sort_column) {
      case 'resident':
        this.options.sort_resident = this.tristate(this.options.sort_resident);
        this.options.sort_room = null;

        this.options = Object.assign({}, this.options);
        break;
      case 'room':
        this.options.sort_resident = null;
        this.options.sort_room = this.tristate(this.options.sort_room);

        this.options = Object.assign({}, this.options);
        break;
    }

    this.subscribe('list_active_first', {type: this.options.type, type_id: this.options.type_id});
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

  select_group(type: number, id: number, name: string) {
    this.type_name = name;
    this.resident_id = null;

    this.subscribe('list_residents', {type: type, type_id: id});

    this.options.type = type;
    this.options.type_id = id;
    this.options = Object.assign({}, this.options);

    this.subscribe('list_active_first', {type: this.options.type, type_id: this.options.type_id});
  }

  resident_changed() {
    if (this.resident_id !== null) {
      this.router$.navigate(
        ['/resident', this.resident_id, {outlets: {'primary': null, 'resident-details': ['responsible-persons']}}]
      );
    }
  }

  show_room_sort(): boolean {
    return this.options.type !== GroupType.REGION;
  }

}
