import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../../shared/components/abstract-form/abstract-form';
import {ActivatedRoute} from '@angular/router';
import {FacilityService} from '../../../../services/facility.service';
import {ApartmentService} from '../../../../services/apartment.service';
import {RegionService} from '../../../../services/region.service';
import {ResidentService} from '../../../../services/resident.service';
import {ResidentType} from '../../../../models/resident-type.enum';
import {Apartment} from '../../../../models/apartment';
import {Facility} from '../../../../models/facility';
import {Region} from '../../../../models/region';
import {Resident} from '../../../../models/resident';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  apartments: Apartment[];
  facilities: Facility[];
  regions: Region[];
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

  constructor(
    private formBuilder: FormBuilder,
    private facility$: FacilityService,
    private apartment$: ApartmentService,
    private region$: RegionService,
    private resident$: ResidentService,
    private route$: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    // this.resident_id = +this.route$.snapshot.firstChild.firstChild.params['id']; // TODO: review
    // this.resident_id = +this.route$.snapshot.firstChild.firstChild.params['id']; // TODO: review

    this.form = this.formBuilder.group({
      group: [null, Validators.required],
      group_all: [false, Validators.required],
      group_id: [null, Validators.required],
      group_type: [null, Validators.required],

      resident_id: [null, Validators.required],
      resident_all: [false, Validators.required],


      date: [new Date(), Validators.required],

      date_from: [new Date(), Validators.required],
      date_to: [new Date(), Validators.required],
    });

    this.form.disable();

    this.facility$.all().pipe(first()).subscribe(res => {
      if (res) {
        this.facilities = res;
        this.facilities.forEach((v, i) => {
          this.facilities[i]['type'] = ResidentType.FACILITY;
        });
      }
    });

    this.apartment$.all().pipe(first()).subscribe(res => {
      if (res) {
        this.apartments = res;
        this.apartments.forEach((v, i) => {
          this.apartments[i]['type'] = ResidentType.APARTMENT;
        });
      }
    });

    this.region$.all().pipe(first()).subscribe(res => {
      if (res) {
        this.regions = res;
        this.regions.forEach((v, i) => {
          this.regions[i]['type'] = ResidentType.REGION;
        });
      }
    });

    this.resident$.all().pipe(first()).subscribe(res => {
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
        this.form.get('group').disable();
        this.form.get('group_id').disable();
      } else {
        this.form.get('group').enable();
        this.form.get('group_id').enable();
      }
    });

    this.form.get('group').valueChanges.subscribe(next => {
      if (next) {
        this.form.get('group_id').setValue(next.id);
        this.form.get('group_type').setValue(next.type);
      }
    });
  }

  private php2js_date_format(format: string) {
    if (format === 'm/d/Y') {
      return 'MM/dd/yyyy';
    } else if (format === 'm/Y') {
      return 'MM/yyyy';
    }

    return null;
  }

  public init_report_parameters(parameters: any) {
    if (parameters.hasOwnProperty('resident')) {
      const parameter_config = parameters['resident'];
      this.show.resident = true;
      this.form.get('resident_id').enable();
      if (parameter_config.select_all) {
        this.show.resident_all = true;
        this.form.get('resident_all').enable();
      }
    }

    if (parameters.hasOwnProperty('group')) {
      const parameter_config = parameters['group'];
      this.show.group = true;
      this.form.get('group').enable();
      this.form.get('group_type').enable();
      this.form.get('group_id').enable();
      if (parameter_config.select_all) {
        this.show.group_all = true;
        this.form.get('group_all').enable();
      }
    }

    if (parameters.hasOwnProperty('date')) {
      const parameter_config = parameters['date'];
      this.show.date = true;
      this.form.get('date').enable();
      this.format_date = this.php2js_date_format(parameter_config);
    }

    if (parameters.hasOwnProperty('date_from')) {
      const parameter_config = parameters['date_from'];
      this.show.date_from = true;
      this.form.get('date_from').enable();
      this.format_date_from = this.php2js_date_format(parameter_config);
    }

    if (parameters.hasOwnProperty('date_to')) {
      const parameter_config = parameters['date_to'];
      this.show.date_to = true;
      this.form.get('date_to').enable();
      this.format_date_to = this.php2js_date_format(parameter_config);
    }
  }

}
