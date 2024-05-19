import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../../shared/components/abstract-form/abstract-form';
import {FacilityService} from '../../../../services/facility.service';
import {ApartmentService} from '../../../../services/apartment.service';
import {RegionService} from '../../../../services/region.service';
import {ResidentService} from '../../../../services/resident.service';
import {GroupType} from '../../../../models/group-type.enum';
import {Resident} from '../../../../models/resident';
import {ResidentSelectorService} from '../../../../services/resident-selector.service';
import {GroupHelper} from '../../../../helper/group-helper';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  GroupType = GroupType;

  protected group_helper: GroupHelper;

  residents: Resident[];

  format_date: string = 'MM/dd/yyyy';
  format_date_from: string = 'MM/yyyy';
  format_date_to: string = 'MM/dd/yyyy';

  resident_id: number;

  show: {
    group: boolean, group_all: boolean,
    resident: boolean, resident_all: boolean,
    date: boolean, date_from: boolean, date_to: boolean
  } = {
    group: false,
    group_all: false,
    resident: false,
    resident_all: false,
    date: false,
    date_from: false,
    date_to: false
  };

  private static php2js_date_format(format: string) {
    if (format === 'm/d/Y') {
      return 'MM/dd/yyyy';
    } else if (format === 'm/Y') {
      return 'MM/yyyy';
    }

    return null;
  }

  constructor(
    private formBuilder: FormBuilder,
    private facility$: FacilityService,
    private apartment$: ApartmentService,
    private region$: RegionService,
    private resident$: ResidentService,
    private residentSelector$: ResidentSelectorService,
  ) {
    super();

    this.group_helper = new GroupHelper();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      group_list: [null, Validators.required],
      group: [null, Validators.required],
      group_id: [null, Validators.required],
      group_all: [false, Validators.required],

      resident_id: [null, Validators.required],
      resident_all: [false, Validators.required],

      date: [new Date(), Validators.required],

      date_from: [new Date(), Validators.required],
      date_to: [new Date(), Validators.required],
    });

    this.form.disable();
    this.form.get('group').enable();

    this.residentSelector$.type.subscribe(next => {
      if (next) {
        this.form.get('group').setValue(next);
      }
    });

    this.residentSelector$.group.subscribe(next => {
      if (next) {
        this.form.get('group_id').setValue(next);
        this.form.get('group_list').setValue(this.group_helper.get_group_data(next, this.form.get('group').value));
      }
    });

    this.facility$.all().pipe(first()).subscribe(res => {
      if (res) {
        this.group_helper.facilities = res;
        this.group_helper.facilities.forEach((v, i) => {
          this.group_helper.facilities[i]['type'] = GroupType.FACILITY;
        });

        this.residentSelector$.group.next(this.residentSelector$.group.value);
      }
    });
    this.apartment$.all().pipe(first()).subscribe(res => {
      if (res) {
        this.group_helper.apartments = res;
        this.group_helper.apartments.forEach((v, i) => {
          this.group_helper.apartments[i]['type'] = GroupType.APARTMENT;
        });

        this.residentSelector$.group.next(this.residentSelector$.group.value);
      }
    });
    this.region$.all().pipe(first()).subscribe(res => {
      if (res) {
        this.group_helper.regions = res;
        this.group_helper.regions.forEach((v, i) => {
          this.group_helper.regions[i]['type'] = GroupType.REGION;
        });

        this.residentSelector$.group.next(this.residentSelector$.group.value);
      }
    });

    this.resident$.list_by_options(true, this.form.get('group').value, this.form.get('group_id').value).pipe(first()).subscribe(res => {
      if (res) {
        this.residents = res;
      }
    });

    this.form.get('resident_all').valueChanges.subscribe(next => {
      if (next) {
        this.form.get('resident_id').disable();
      } else {
        this.form.get('resident_id').enable();
      }
    });

    this.form.get('group_all').valueChanges.subscribe(next => {
      if (next) {
        this.form.get('group_id').disable();
        this.form.get('group_list').disable();
      } else {
        this.form.get('group_id').enable();
        this.form.get('group_list').enable();
      }
    });

    this.form.get('group_list').valueChanges.subscribe(next => {
      if (next) {
        this.form.get('group').setValue(next.type);
        this.form.get('group_id').setValue(next.id);
      }
    });

  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'rs_resident':
        this.$subscriptions[key] = this.residentSelector$.resident.subscribe(next => {
          if (next) {
            this.form.get('resident_id').setValue(next);
          }
        });
        break;
      default:
        break;
    }
  }

  public init_report_parameters(parameters: any) {
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

    if (parameters.hasOwnProperty('group')) {
      const parameter_config = parameters['group'];
      this.show.group = true;
      this.form.get('group_id').enable();
      this.form.get('group_list').enable();

      this.form.get('group_id').setValue(this.residentSelector$.group.value);
      this.form.get('group_list').setValue(this.group_helper.get_group_data(this.residentSelector$.group.value, this.form.get('group').value));

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
