import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {SpaceService} from '../../../../services/space.service';
import {first} from 'rxjs/operators';
import {Space} from '../../../../models/space';
import {CoreValidator} from '../../../../../shared/utils/core-validator';
import {ActivityStatusService} from '../../../services/activity-status.service';
import {ActivityStatus} from '../../../models/activity-status';
import {ModalFormService} from '../../../../../shared/services/modal-form.service';
import {FormComponent as ActivityStatusFormComponent} from '../../activity-status/form/form.component';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  spaces: Space[];
  activity_statuses: ActivityStatus[];

  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder,
    private space$: SpaceService,
    private activity_status$: ActivityStatusService
  ) {
    super(modal$);
    this.modal_map = [
         {key: 'activity_status', component: ActivityStatusFormComponent}
    ];
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      title: ['', Validators.compose([CoreValidator.notEmpty, Validators.maxLength(200)])],

      assign_to: [false, Validators.required],
      due_date: [false, Validators.required],
      reminder_date: [false, Validators.required],
      cc: [false, Validators.required],
      sms: [false, Validators.required],
      facility: [false, Validators.required],

      contact: [false, Validators.required],
      amount: [false, Validators.required],

      editable: [true, Validators.required],
      deletable: [true, Validators.required],

      default_status_id: [null, Validators.required]
    });

    this.subscribe('list_activity_status');
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'list_space':
        this.$subscriptions[key] = this.space$.all().pipe(first()).subscribe(res => {
          if (res) {
            res.sort((a, b) => a.name.localeCompare(b.name));
            this.spaces = res;
          }
        });
        break;
      case 'list_activity_status':
        this.$subscriptions[key] = this.activity_status$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.activity_statuses = res;

            if (params) {
              this.form.get('default_status_id').setValue(params.activity_status_id);
            }
          }
        });
        break;
      default:
        break;
    }
  }

}
