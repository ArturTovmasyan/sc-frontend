import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {FacilityService} from '../../../services/facility.service';
import {Facility} from '../../../models/facility';
import {CoreValidator} from '../../../../../shared/utils/core-validator';
import {ModalFormService} from '../../../../../shared/services/modal-form.service';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  facilities: Facility[];

  private _show_facility: boolean = true;

  get show_facility(): boolean {
    return this._show_facility;
  }

  set show_facility(value: boolean) {
    this._show_facility = value;
  }

  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder,
    private facility$: FacilityService
  ) {
    super(modal$);
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      title: ['', Validators.compose([CoreValidator.notEmpty, Validators.maxLength(50)])],
      facility_id: [null, Validators.required]
    });

    this.subscribe('list_facility');
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'list_facility':
        this.$subscriptions[key] = this.facility$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.facilities = res;
          }
        });
        break;
      default:
        break;
    }
  }
}
