import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {FacilityService} from '../../../services/facility.service';
import {Facility} from '../../../models/facility';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  facilities: Facility[];

  constructor(private formBuilder: FormBuilder, private facility$: FacilityService) {
    super();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      title: ['', Validators.compose([Validators.required, Validators.max(50)])],
      facility_id: [null, Validators.required]
    });

    this.facility$.all().pipe(first()).subscribe(res => {
      if (res) {
        this.facilities = res;
      }
    });
  }

}
