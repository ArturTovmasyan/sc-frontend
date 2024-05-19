import {Component, OnDestroy, OnInit} from '@angular/core';
import {TitleService} from '../../../../services/title.service';
import {GroupHelper} from '../../../helper/group-helper';
import {Subscription} from 'rxjs';
import {FacilityService} from '../../../services/facility.service';
import {ApartmentService} from '../../../services/apartment.service';
import {RegionService} from '../../../services/region.service';
import {AuthGuard} from '../../../../guards/auth.guard';
import {first} from 'rxjs/operators';
import {GroupType} from '../../../models/group-type.enum';
import {ActivatedRoute, Router} from '@angular/router';
import {ResidentAdmissionService} from '../../../services/resident-admission.service';

@Component({
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  providers: []
})
export class IndexComponent implements OnInit, OnDestroy {
  GroupType = GroupType;

  title: string;

  mode: boolean = false; // true - thumbnail, false - list

  group: any;

  options: { state?: string, type?: number, type_id?: number, sort_resident?: boolean, sort_room?: boolean } = {
    sort_resident: null,
    sort_room: null,
  };

  group_helper: GroupHelper;

  resident_id: number;
  residents: any;

  type_name: string;

  private $subscriptions: { [key: string]: Subscription; };

  constructor(
    protected title$: TitleService,
    private facility$: FacilityService,
    private apartment$: ApartmentService,
    private region$: RegionService,
    private residentAdmission$: ResidentAdmissionService,
    private router$: Router,
    protected route$: ActivatedRoute,
    private auth_$: AuthGuard,
  ) {
    this.title$.getTitle().subscribe(v => this.title = v);
    this.group_helper = new GroupHelper();

    this.$subscriptions = {};
  }

  ngOnInit(): void {
    this.subscribe('segment');
  }

  ngOnDestroy(): void {
    Object.keys(this.$subscriptions).forEach(key => this.$subscriptions[key].unsubscribe());
  }

  unsubscribe(key: string): void {
    if (this.$subscriptions.hasOwnProperty(key)) {
      this.$subscriptions[key].unsubscribe();
    }
  }

  subscribe(key: string, params?: any) {
    switch (key) {
      case 'query':
        this.$subscriptions[key] = this.route$.queryParams.subscribe(value => {
          if (value && value.hasOwnProperty('mode')) {
            this.mode = value.mode === 'true';
          } else {
            this.mode = false;
          }
        });
        break;
      case 'segment':
        this.$subscriptions[key] = this.route$.url.subscribe(value => {
          if (value && value.length > 0) {
            if (value.length === 2) {
              this.options.state = value[1].path;
            } else if (value.length === 3) {
              this.options.type = parseInt(value[1].path, 10);
              this.options.type_id = parseInt(value[2].path, 10);
              this.subscribe('get_title');
            }

            if (this.options.state !== null && this.options.state !== undefined && this.options.state !== 'no-admission') {
              this.subscribe('list_facility');
              this.subscribe('list_apartment');
              this.subscribe('list_region');
            }

            this.subscribe('query');
          }
        });
        break;
      case 'get_title':
        if (this.options.type !== null && this.options.type !== undefined) {
          switch (this.options.type) {
            case GroupType.FACILITY:
              params = {service: this.facility$, id: this.options.type_id};
              break;
            case GroupType.APARTMENT:
              params = {service: this.apartment$, id: this.options.type_id};
              break;
            case GroupType.REGION:
              params = {service: this.region$, id: this.options.type_id};
              break;
          }

          this.$subscriptions[key] = params.service.get(params.id).pipe(first()).subscribe(res => {
            if (res) {
              this.title$.setTitle(res.name);
              this.select_group(this.options.type, this.options.type_id, null);
            }
          });
        } else {
          switch (this.options.state) {
            case 'active':
              this.title$.setTitle('Current');
              break;
            case 'inactive':
              this.title$.setTitle('Moved-Out');
              break;
            case 'no-admission':
              this.title$.setTitle('Moving In');
              break;
          }
        }
        break;
      case 'list_facility':
        this.$subscriptions[key] = this.facility$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.group_helper.facilities = res;
            this.group_helper.facilities.forEach((v, i) => {
              this.group_helper.facilities[i]['type'] = GroupType.FACILITY;
            });

            this.group = this.group_helper.get_group_data(this.options.type_id, this.options.type);
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

            this.group = this.group_helper.get_group_data(this.options.type_id, this.options.type);
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

            this.group = this.group_helper.get_group_data(this.options.type_id, this.options.type);
          }
        });
        break;
      case 'list_residents':
        this.$subscriptions[key] = this.residentAdmission$
          .list_by_state('active', params.type, params.type_id)
          .pipe(first()).subscribe(res => {
            if (res) {
              this.residents = res;
            }
          });
        break;
      default:
        break;
    }
  }

  mode_changed() {
    this.mode = !this.mode;
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

    // this.subscribe('list_active_first', {type: GroupType.FACILITY, type_id: this.type_id});
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

  }

  resident_changed() {
    if (this.resident_id !== null) {
      this.router$.navigate(
        ['/resident', this.resident_id, {outlets: {'primary': null, 'resident-details': ['responsible-persons']}}]
      );
    }
  }

  show_room_sort(): boolean {
    return (this.options.state !== null && this.options.state !== undefined && this.options.state !== 'no-admission') ||
      ((this.options.state === null || this.options.state === undefined) && (this.options.type !== null && this.options.type !== undefined
        && this.options.type_id !== null && this.options.type_id !== undefined));
  }

  show_title() {
    return (this.options.state === null || this.options.state === undefined) || (this.options.state === 'no-admission');
  }
}
