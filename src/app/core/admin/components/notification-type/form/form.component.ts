import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {SpaceService} from '../../../../services/space.service';
import {first} from 'rxjs/operators';
import {Space} from '../../../../models/space';
import {AuthGuard} from '../../../../guards/auth.guard';
import {CoreValidator} from '../../../../../shared/utils/core-validator';
import {NotificationCategory} from '../../../../models/notification-category.enum';
import {ModalFormService} from '../../../../../shared/services/modal-form.service';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  spaces: Space[];

  categories: { id: NotificationCategory, name: string }[];

  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder,
    private space$: SpaceService,
    private auth_$: AuthGuard
  ) {
    super(modal$);
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      category: [null, Validators.required],
      title: ['', Validators.compose([CoreValidator.notEmpty, Validators.maxLength(60)])],
      email: [false, Validators.required],
      sms: [false, Validators.required],

      facility: [false, Validators.required],
      apartment: [false, Validators.required],
      region: [false, Validators.required],

      email_subject: ['', Validators.compose([Validators.maxLength(120)])],
      email_message: ['', Validators.compose([Validators.maxLength(1000)])],

      sms_subject: ['', Validators.compose([Validators.maxLength(120)])],
      sms_message: ['', Validators.compose([Validators.maxLength(1000)])]
    });

    this.categories = [
      {id: NotificationCategory.SIXTY_DAYS_REPORT, name: 'list.notification_category.SIXTY_DAYS_REPORT'},
      {id: NotificationCategory.LEAD_ACTIVITY, name: 'list.notification_category.LEAD_ACTIVITY'},
      {id: NotificationCategory.LEAD_CHANGE_LOG, name: 'list.notification_category.LEAD_CHANGE_LOG'}
    ];

    this.add_space();
  }

  private add_space() {
    if (this.auth_$.checkPermission(['persistence-security-space'])) {
      this.form.addControl('space_id', new FormControl(null, [Validators.required]));
      this.subscribe('list_space');
    }
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
      default:
        break;
    }
  }
}
