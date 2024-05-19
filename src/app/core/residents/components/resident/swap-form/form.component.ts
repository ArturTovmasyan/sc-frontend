import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {DateHelper} from '../../../../../shared/helpers/date-helper';
import {ModalFormService} from '../../../../../shared/services/modal-form.service';
import {Resident} from '../../../models/resident';
import {ResidentAdmissionService} from '../../../services/resident-admission.service';
import {GroupType} from '../../../models/group-type.enum';
import {ResidentSelectorService} from '../../../services/resident-selector.service';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  residents: Resident[];

  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder,
    private resident$: ResidentAdmissionService,
    public residentSelector$: ResidentSelectorService
  ) {
    super(modal$);
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      date: [new Date(), Validators.required],

      first_id: [null, Validators.required],
      second_id: [null, Validators.required],
    });

    this.subscribe('rs_resident');
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'list_resident':
        this.$subscriptions[key] = this.resident$
          .list_by_state('active', GroupType.FACILITY, params.facility_id).pipe(first()).subscribe(res => {
            if (res) {
              this.residents = res;

              this.form.get('first_id').setValue(this.residentSelector$.resident.value);
            }
          });
        break;
      case 'rs_resident':
        this.$subscriptions[key] = this.residentSelector$.resident.subscribe(next => {
          if (next) {
            this.subscribe('list_resident', {facility_id: this.residentSelector$.group.value});
          }
        });
        break;
      default:
        break;
    }
  }

}
