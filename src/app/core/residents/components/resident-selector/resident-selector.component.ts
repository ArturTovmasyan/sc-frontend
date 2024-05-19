import {Component, OnDestroy, OnInit} from '@angular/core';
import {first} from 'rxjs/operators';
import {FacilityService} from '../../services/facility.service';
import {ApartmentService} from '../../services/apartment.service';
import {RegionService} from '../../services/region.service';
import {Resident} from '../../models/resident';
import {GroupType} from '../../models/group-type.enum';
import {Router} from '@angular/router';
import {ResidentSelectorService} from '../../services/resident-selector.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';
import {GroupHelper} from '../../helper/group-helper';
import {ResidentAdmissionService} from '../../services/resident-admission.service';
import {SpaceService} from '../../../services/space.service';
import {AuthGuard} from '../../../guards/auth.guard';

@Component({
  selector: 'app-resident-selector',
  templateUrl: './resident-selector.component.html',
  styleUrls: ['./resident-selector.component.scss']
})
export class ResidentSelectorComponent implements OnInit, OnDestroy {
  public form: FormGroup;

  public group_helper: GroupHelper;

  public active_residents: Resident[];
  public inactive_residents: Resident[];

  private $subscriptions: { [key: string]: Subscription; };

  constructor(
    private formBuilder: FormBuilder,
    private facility$: FacilityService,
    private apartment$: ApartmentService,
    private region$: RegionService,
    private residentAdmission$: ResidentAdmissionService,
    private router$: Router,
    private auth_$: AuthGuard,
    public residentSelector$: ResidentSelectorService
  ) {
    this.group_helper = new GroupHelper();

    this.$subscriptions = {};
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      group: [null],
      active_resident_id: [null],
      inactive_resident_id: [null]
    });

    this.subscribe('vc_group');
    this.subscribe('vc_active_resident_id');
    this.subscribe('vc_inactive_resident_id');

    this.subscribe('rs_group');
    this.subscribe('rs_resident');

    this.subscribe('list_facility');
    this.subscribe('list_apartment');
    this.subscribe('list_region');
  }

  ngOnDestroy(): void {
    Object.keys(this.$subscriptions).forEach(key => this.$subscriptions[key].unsubscribe());
  }

  unsubscribe(key: string): void {
    if (this.$subscriptions.hasOwnProperty(key)) {
      this.$subscriptions[key].unsubscribe();
    }
  }

  subscribe(key: string) {
    switch (key) {
      case 'vc_group':
        this.$subscriptions[key] = this.form.get('group').valueChanges.subscribe(next => {
          if (next === null) {
            return;
          }

          if (next !== this.group_helper.no_admission) {
            this.residentSelector$.type.next(next.type);
            this.residentSelector$.group.next(next.id);
          } else {
            this.subscribe('list_no_admission');
          }
        });
        break;
      case 'vc_active_resident_id':
        this.$subscriptions[key] = this.form.get('active_resident_id').valueChanges.subscribe(next => {
          if (next) {
            this.residentSelector$.resident.next(next);
            this.router$.navigate(this.routeInfo('responsible-persons'));
          }
        });
        break;
      case 'vc_inactive_resident_id':
        this.$subscriptions[key] = this.form.get('inactive_resident_id').valueChanges.subscribe(next => {
          if (next) {
            this.residentSelector$.resident.next(next);
            this.router$.navigate(this.routeInfo('responsible-persons'));
          }
        });
        break;
      case 'rs_group':
        this.$subscriptions[key] = this.residentSelector$.group.subscribe(next => {
          this.active_residents = [];
          this.inactive_residents = [];

          this.form.get('active_resident_id').setValue(null);
          this.form.get('inactive_resident_id').setValue(null);

          if (next) {
            this.unsubscribe('vc_group');
            this.form.get('group').setValue(this.group_helper.get_group_data(next, this.residentSelector$.type.value));
            this.subscribe('vc_group');

            this.subscribe('list_active_resident');
            this.subscribe('list_inactive_resident');
          } else {
            this.form.get('group').setValue(this.group_helper.no_admission);
          }
        });
        break;
      case 'rs_resident':
        this.$subscriptions[key] = this.residentSelector$.resident.subscribe(next => {
          if (next) {
            this.unsubscribe('vc_active_resident_id');
            this.form.get('active_resident_id').setValue(next);
            this.subscribe('vc_active_resident_id');

            this.unsubscribe('vc_inactive_resident_id');
            this.form.get('inactive_resident_id').setValue(next);
            this.subscribe('vc_inactive_resident_id');
          }
        });
        break;
      case 'list_active_resident':
        this.$subscriptions[key] = this.residentAdmission$
          .list_by_options(true, this.residentSelector$.type.value, this.residentSelector$.group.value)
          .pipe(first()).subscribe(res => {
            if (res) {
              this.active_residents = res;

              if (this.active_residents.filter(v => v.id === this.residentSelector$.resident.value).length > 0) {
                this.unsubscribe('vc_active_resident_id');
                this.form.get('active_resident_id').setValue(this.residentSelector$.resident.value);
                this.subscribe('vc_active_resident_id');
              } else {
                this.unsubscribe('vc_active_resident_id');
                this.form.get('active_resident_id').setValue(null);
                this.subscribe('vc_active_resident_id');
              }
            }
          });
        break;
      case 'list_inactive_resident':
        this.$subscriptions[key] = this.residentAdmission$
          .list_by_options(false, this.residentSelector$.type.value, this.residentSelector$.group.value)
          .pipe(first()).subscribe(res => {
            if (res) {
              this.inactive_residents = res;

              if (this.inactive_residents.filter(v => v.id === this.residentSelector$.resident.value).length > 0) {
                this.unsubscribe('vc_inactive_resident_id');
                this.form.get('inactive_resident_id').setValue(this.residentSelector$.resident.value);
                this.subscribe('vc_inactive_resident_id');
              } else {
                this.unsubscribe('vc_inactive_resident_id');
                this.form.get('inactive_resident_id').setValue(null);
                this.subscribe('vc_inactive_resident_id');
              }
            }
          });
        break;
      case 'list_no_admission':
        this.$subscriptions[key] = this.residentAdmission$
          .list_by_options(false, null, null)
          .pipe(first()).subscribe(res => {
            if (res) {
              this.active_residents = null;
              this.unsubscribe('vc_active_resident_id');
              this.form.get('active_resident_id').setValue(null);
              this.subscribe('vc_active_resident_id');

              this.inactive_residents = res;

              if (this.inactive_residents.filter(v => v.id === this.residentSelector$.resident.value).length > 0) {
                this.unsubscribe('vc_inactive_resident_id');
                this.form.get('inactive_resident_id').setValue(this.residentSelector$.resident.value);
                this.subscribe('vc_inactive_resident_id');
              } else {
                this.unsubscribe('vc_inactive_resident_id');
                this.form.get('inactive_resident_id').setValue(null);
                this.subscribe('vc_inactive_resident_id');
              }
            }
          });
        break;
      case 'list_facility':
        this.$subscriptions[key] = this.facility$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.group_helper.facilities = res;
            this.group_helper.facilities.forEach((v, i) => {
              this.group_helper.facilities[i]['type'] = GroupType.FACILITY;
            });

            if (this.residentSelector$.type.value === GroupType.FACILITY) {
              const group_obj = this.group_helper.get_group_data(this.residentSelector$.group.value, this.residentSelector$.type.value);

              if (group_obj !== null) {
                this.unsubscribe('vc_group');
                this.form.get('group').setValue(group_obj);
                this.subscribe('vc_group');
              }
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

            if (this.residentSelector$.type.value === GroupType.APARTMENT) {
              const group_obj = this.group_helper.get_group_data(this.residentSelector$.group.value, this.residentSelector$.type.value);

              if (group_obj !== null) {
                this.unsubscribe('vc_group');
                this.form.get('group').setValue(group_obj);
                this.subscribe('vc_group');
              }
            }
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

            if (this.residentSelector$.type.value === GroupType.REGION) {
              const group_obj = this.group_helper.get_group_data(this.residentSelector$.group.value, this.residentSelector$.type.value);

              if (group_obj !== null) {
                this.unsubscribe('vc_group');
                this.form.get('group').setValue(group_obj);
                this.subscribe('vc_group');
              }
            }
          }
        });
        break;
      default:
        break;
    }
  }

  routeInfo(route_name: string) {
    const resident_id = this.residentSelector$.resident.value;

    return ['/resident', resident_id, {outlets: {'resident-details': [route_name]}}];
  }

  addIfHasPermission(permission: string) {
    return this.auth_$.checkPermission([permission]);
  }
}
