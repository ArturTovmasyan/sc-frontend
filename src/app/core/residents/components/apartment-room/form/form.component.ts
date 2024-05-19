import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {ApartmentService} from '../../../services/apartment.service';
import {Apartment} from '../../../models/apartment';
import {RoomType} from '../../../models/room-type';
import {ValidationPatterns} from '../../../../../shared/constants/validation.patterns';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  apartments: Apartment[];
  types: { id: RoomType, name: string }[];

  constructor(private formBuilder: FormBuilder, private apartment$: ApartmentService) {
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
      apartment_id: [null, Validators.required]
    });

    this.apartment$.all().pipe(first()).subscribe(res => {
      if (res) {
        this.apartments = res;
      }
    });

    this.types = [
      {id: RoomType.PRIVATE, name: 'Private'},
      {id: RoomType.SEMI_PRIVATE, name: 'Semi-Private'}
    ];
  }

}
