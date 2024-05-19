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
      physician_optional: [false, Validators.required],
      responsible_person: [false, Validators.required],
      responsible_person_optional: [false, Validators.required],
      responsible_person_multi: [false, Validators.required],
      responsible_person_multi_optional: [false, Validators.required],
      additional_date: [false, Validators.required],
    });

    this.subscribe('vc_physician');
    this.subscribe('vc_physician_optional');
    this.subscribe('vc_responsible_person');
    this.subscribe('vc_responsible_person_optional');
    this.subscribe('vc_responsible_person_multi');
    this.subscribe('vc_responsible_person_multi_optional');

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
      case 'vc_physician':
        this.$subscriptions[key] = this.form.get('physician').valueChanges.subscribe(res => {
          if (res) {
            this.form.get('physician_optional').setValue(false);
          }
        });
        break;
      case 'vc_physician_optional':
        this.$subscriptions[key] = this.form.get('physician_optional').valueChanges.subscribe(res => {
          if (res) {
            this.form.get('physician').setValue(false);
          }
        });
        break;
      case 'vc_responsible_person':
        this.$subscriptions[key] = this.form.get('responsible_person').valueChanges.subscribe(res => {
          if (res) {
            this.form.get('responsible_person_optional').setValue(false);
            this.form.get('responsible_person_multi').setValue(false);
            this.form.get('responsible_person_multi_optional').setValue(false);
          }
        });
        break;
      case 'vc_responsible_person_optional':
        this.$subscriptions[key] = this.form.get('responsible_person_optional').valueChanges.subscribe(res => {
          if (res) {
            this.form.get('responsible_person').setValue(false);
            this.form.get('responsible_person_multi').setValue(false);
            this.form.get('responsible_person_multi_optional').setValue(false);
          }
        });
        break;
      case 'vc_responsible_person_multi':
        this.$subscriptions[key] = this.form.get('responsible_person_multi').valueChanges.subscribe(res => {
          if (res) {
            this.form.get('responsible_person').setValue(false);
            this.form.get('responsible_person_optional').setValue(false);
            this.form.get('responsible_person_multi_optional').setValue(false);
          }
        });
        break;
      case 'vc_responsible_person_multi_optional':
        this.$subscriptions[key] = this.form.get('responsible_person_multi_optional').valueChanges.subscribe(res => {
          if (res) {
            this.form.get('responsible_person').setValue(false);
            this.form.get('responsible_person_optional').setValue(false);
            this.form.get('responsible_person_multi').setValue(false);
          }
        });
        break;
      default:
        break;
    }
  }
}
