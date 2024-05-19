import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {FacilityService} from '../../../services/facility.service';
import {Facility} from '../../../models/facility';
import {RoomType} from '../../../models/room-type';
import {ValidationPatterns} from '../../../../../shared/constants/validation.patterns';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  facilities: Facility[];
  types: { id: RoomType, name: string }[];

  constructor(private formBuilder: FormBuilder, private facility$: FacilityService) {
    super();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      number: ['', Validators.compose([Validators.required])],
      floor: ['', Validators.compose([Validators.required, Validators.pattern(ValidationPatterns.FLOOR)])],
      type: ['', Validators.compose([Validators.required])],
      disabled: [false, Validators.compose([Validators.required])],
      shared: [false, Validators.compose([Validators.required])],
      notes: ['', Validators.compose([Validators.required, Validators.max(1000)])],
      facility_id: [null, Validators.required]
    });

    this.facility$.all().pipe(first()).subscribe(res => {
      if (res) {
        this.facilities = res;
      }
    });

    this.types = [
      {id: RoomType.PRIVATE, name: 'Private'},
      {id: RoomType.SEMI_PRIVATE, name: 'Semi-Private'}
    ];
  }

}
