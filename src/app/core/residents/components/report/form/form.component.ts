﻿import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {FacilityService} from '../../../services/facility.service';
import {ApartmentService} from '../../../services/apartment.service';
import {RegionService} from '../../../services/region.service';
import {GroupType} from '../../../models/group-type.enum';
import {Resident} from '../../../models/resident';
import {ResidentSelectorService} from '../../../services/resident-selector.service';
import {GroupHelper} from '../../../helper/group-helper';
import {ResidentAdmissionService} from '../../../services/resident-admission.service';
import {DateHelper} from '../../../../../shared/helpers/date-helper';
import {AssessmentForm} from '../../../models/assessment-form';
import {AssessmentFormService} from '../../../services/assessment-form.service';
import {ModalFormService} from '../../../../../shared/services/modal-form.service';
import {differenceInCalendarDays} from 'date-fns';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  GroupType = GroupType;

  protected group_helper: GroupHelper;

  residents: Resident[];
  assessments: AssessmentForm[];

  format_date: string = 'MM/dd/yyyy';
  format_date_from: string = 'MM/yyyy';
  format_date_to: string = 'MM/dd/yyyy';

  title: string;

  disabled: boolean;

  show: {
    group: boolean, group_multi: boolean, group_all: boolean,
    resident: boolean, resident_all: boolean,
    date: boolean, date_from: boolean, date_to: boolean, discontinued: boolean, special: boolean,
    assessment: boolean
  } = {
    group: false,
    group_multi: false,
    group_all: false,
    resident: false,
    resident_all: false,
    date: false,
    date_from: false,
    date_to: false,
    discontinued: false,
    special: false,
    assessment: false
  };

  private static php2js_date_format(format: string) {
    if (format === 'm/d/Y') {
      return 'MM/dd/yyyy';
    } else if (format === 'm/Y') {
      return 'MM/yyyy';
    } else if (format === 'Y') {
      return 'yyyy';
    }

    return null;
  }

  disabledDate = (current: Date): boolean => {
    return current > DateHelper.newDate();
  };

  disabledEndDate = (current: Date): boolean => {
    this.disabled = current > DateHelper.newDate();

    if (this.form.get('date_to').enabled && this.form.get('date_from').enabled) {
      this.disabled = current > DateHelper.newDate() || differenceInCalendarDays(current, this.form.get('date_from').value) < 0;
    }

    return this.disabled;
  };

  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder,
    private facility$: FacilityService,
    private apartment$: ApartmentService,
    private region$: RegionService,
    private assessmentForm$: AssessmentFormService,
    private residentAdmission$: ResidentAdmissionService,
    private residentSelector$: ResidentSelectorService,
  ) {
    super(modal$);

    this.group_helper = new GroupHelper();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      group_list: [null, Validators.required],
      group: [null, Validators.required],
      group_id: [null, Validators.required],
      group_ids: [null, Validators.required],
      group_all: [false, Validators.required],

      resident_id: [null, Validators.required],
      resident_all: [false, Validators.required],

      assessment_form_id: [null, Validators.required],

      date: [DateHelper.newDate(), Validators.required],

      date_from: [DateHelper.newDate(), Validators.required],
      date_to: [DateHelper.newDate(), Validators.required],

      discontinued: [false, Validators.required],
    });

    this.form.disable();

    this.subscribe('rs_resident');
    this.subscribe('rs_type');
    this.subscribe('rs_group');

    this.subscribe('list_facility');
    this.subscribe('list_apartment');
    this.subscribe('list_region');

    this.subscribe('list_assessment');
    this.subscribe('vc_resident_all');
    this.subscribe('vc_group_all');
    this.subscribe('vc_group_list');
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'list_assessment':
        this.$subscriptions[key] = this.assessmentForm$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.assessments = res;
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

            this.residentSelector$.group.next(this.residentSelector$.group.value);
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

            this.residentSelector$.group.next(this.residentSelector$.group.value);
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

            this.residentSelector$.group.next(this.residentSelector$.group.value);
          }
        });
        break;
      case 'list_admission':
        this.$subscriptions[key] = this.residentAdmission$
          .list_by_state(this.residentSelector$.state.value, this.form.get('group').value, this.form.get('group_id').value)
          .pipe(first()).subscribe(res => {
            if (res) {
              this.residents = res;
            }
          });
        break;
      case 'rs_state':
        this.$subscriptions[key] = this.residentSelector$.state.subscribe(next => {
          if (next) {
            if (this.form.get('group').value !== null && this.form.get('group_id').value !== null) {
              this.subscribe('list_admission');
            }
          }
        });
        break;
      case 'rs_resident':
        this.$subscriptions[key] = this.residentSelector$.resident.subscribe(next => {
          if (next) {
            this.form.get('resident_id').setValue(next);
          }
        });
        break;
      case 'rs_type':
        this.$subscriptions[key] = this.residentSelector$.type.subscribe(next => {
          if (next) {
            this.form.get('group').setValue(next);
          }
        });
        break;
      case 'rs_group':
        this.$subscriptions[key] = this.residentSelector$.group.subscribe(next => {
          if (next) {
            if (!this.show.group_multi) {
              this.form.get('group_id').setValue(next);
              this.form.get('group_list').setValue(this.group_helper.get_group_data(next, this.form.get('group').value));
            }
          }

          this.subscribe('rs_state');
        });
        break;
      case 'vc_resident_all':
        this.$subscriptions[key] = this.form.get('resident_all').valueChanges.subscribe(next => {
          if (next) {
            this.form.get('resident_id').disable();
          } else {
            this.form.get('resident_id').enable();
          }
        });
        break;
      case 'active_resident_list_admission':
        this.$subscriptions[key] = this.residentAdmission$
          .list_by_state('active', this.form.get('group').value, this.form.get('group_id').value)
          .pipe(first()).subscribe(res => {
            if (res) {
              this.residents = res;
            }
          });
        break;
      case 'vc_group_list':
        this.$subscriptions[key] = this.form.get('group_list').valueChanges.subscribe(next => {
          if (next) {
            if (this.show.group_multi) {
                if (next.length > 0) {
                    this.form.get('group').setValue(next.map(v => v.type).pop()); // TODO: review
                    this.form.get('group_ids').setValue(next.map(v => v.id));
                }
            } else {
              this.form.get('group').setValue(next.type);
              this.form.get('group_id').setValue(next.id);

              if (this.show.special) {
                this.show.resident = true;
                if (this.form.get('group').value !== null && this.form.get('group_id').value !== null) {
                  this.form.get('resident_id').setValue(null);
                  this.subscribe('active_resident_list_admission');
                }
              }
            }
          }
        });
        break;
      case 'vc_group_all':
        this.$subscriptions[key] = this.form.get('group_all').valueChanges.subscribe(next => {
          if (next) {
            this.form.get('group_id').disable();
            this.form.get('group_ids').disable();
            this.form.get('group_list').disable();
          } else {
            if (this.show.group_multi) {
              this.form.get('group_ids').enable();
            } else {
              this.form.get('group_id').enable();
            }
            this.form.get('group_list').enable();
          }

          // this.form.get('group').setValue(GroupType.FACILITY); // TODO: review this when enabling apartment and region
          this.form.get('group').updateValueAndValidity();
        });
        break;
      default:
        break;
    }
  }

  public init_report_parameters(title: string, parameters: any) {
    this.title = title;

    if (parameters.hasOwnProperty('form')) {
      this.show.assessment = true;
      this.form.get('assessment_form_id').enable();
    } else {
      this.form.get('group').enable();
    }

    if (parameters.hasOwnProperty('resident')) {
      const parameter_config = parameters['resident'];
      this.show.resident = true;
      this.form.get('resident_id').enable();
      this.form.get('resident_id').setValue(this.residentSelector$.resident.value);

      if (parameter_config.select_all) {
        this.show.resident_all = true;
        this.form.get('resident_all').enable();
      }
    }

    if (parameters.hasOwnProperty('discontinued')) {
      const parameter_config = parameters['discontinued'];
      this.show.discontinued = false;
      if (this.form.get('group').value === GroupType.FACILITY) {
          this.show.discontinued = true;
      }
      this.form.get('discontinued').enable();
      this.form.get('discontinued').setValue(false);
    }

    if (parameters.hasOwnProperty('special')) {
      this.show.resident = false;
      this.show.special = true;
    }

    if (parameters.hasOwnProperty('group')) {
      const parameter_config = parameters['group'];
      this.show.group = true;
      this.form.get('group').enable();
      this.form.get('group_list').enable();

      if (parameter_config.select_multi) {
        this.show.group_multi = true;
        this.form.get('group_ids').enable();

        let group_value = [];
        let group_list_value = [];

        const rs_gidv = this.residentSelector$.group.value;
        const rs_gv = this.group_helper.get_group_data(this.residentSelector$.group.value, this.form.get('group').value);

        if (rs_gidv !== null && rs_gv !== null) {
          group_value = [rs_gidv];
          group_list_value = [rs_gv];
        }

        this.form.get('group_ids').setValue(group_value);
        this.form.get('group_list').setValue(group_list_value);
      } else {
        this.show.group_multi = false;
        this.form.get('group_id').enable();
        this.form.get('group_id').setValue(this.residentSelector$.group.value);
        this.form.get('group_list').setValue(
          this.group_helper.get_group_data(this.residentSelector$.group.value, this.form.get('group').value)
        );
      }

      if (parameter_config.select_all) {
        this.show.group_all = true;
        this.form.get('group_all').enable();
      }
    }

    if (parameters.hasOwnProperty('date')) {
      const parameter_config = parameters['date'];
      this.show.date = true;
      this.form.get('date').enable();
      this.format_date = FormComponent.php2js_date_format(parameter_config);
    }

    if (parameters.hasOwnProperty('date_from')) {
      const parameter_config = parameters['date_from'];
      this.show.date_from = true;
      this.form.get('date_from').enable();
      this.format_date_from = FormComponent.php2js_date_format(parameter_config);
    }

    if (parameters.hasOwnProperty('date_to')) {
      const parameter_config = parameters['date_to'];
      this.show.date_to = true;
      this.form.get('date_to').enable();
      this.format_date_to = FormComponent.php2js_date_format(parameter_config);
    }
  }

}
