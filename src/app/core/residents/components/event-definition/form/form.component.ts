import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {SpaceService} from '../../../../services/space.service';
import {Space} from '../../../../models/space';
import {AuthGuard} from '../../../../guards/auth.guard';
import {CoreValidator} from '../../../../../shared/utils/core-validator';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  spaces: Space[];

  constructor(
    private formBuilder: FormBuilder,
    private space$: SpaceService,
    private auth_$: AuthGuard
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      title: ['', Validators.compose([CoreValidator.notEmpty, Validators.maxLength(100)])],

      ffc: [true, Validators.required],
      ihc: [true, Validators.required],
      il: [true, Validators.required],

      physician: [false, Validators.required],
      responsible_person: [false, Validators.required],
      responsible_person_multi: [false, Validators.required],
      additional_date: [false, Validators.required],
    });

    this.add_space();
  }

  private add_space() {
    if (this.auth_$.checkPermission(['persistence-security-space'])) {
      this.form.addControl('space_id', new FormControl(null, [Validators.required]));
      this.subscribe('list_space');
    }
  }

  after_set_form_data(): void {
    this.subscribe('vc_responsible_person');
    this.subscribe('vc_responsible_person_multi');

    super.after_set_form_data();
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
      case 'vc_responsible_person':
        this.$subscriptions[key] = this.form.get('responsible_person').valueChanges.subscribe(res => {
          if (res) {
            this.form.get('responsible_person_multi').setValue(false);
          }
        });
        break;
      case 'vc_responsible_person_multi':
        this.$subscriptions[key] = this.form.get('responsible_person_multi').valueChanges.subscribe(res => {
          if (res) {
            this.form.get('responsible_person').setValue(false);
          }
        });
        break;
      default:
        break;
    }
  }
}
