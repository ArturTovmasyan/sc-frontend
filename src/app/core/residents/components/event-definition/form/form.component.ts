import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {SpaceService} from '../../../../services/space.service';
import {Space} from '../../../../models/space';
import {AuthGuard} from '../../../../guards/auth.guard';
import {CoreValidator} from '../../../../../shared/utils/core-validator';
import {ModalFormService} from '../../../../../shared/services/modal-form.service';
import {EventDefinitionType, EventDefinitionView} from '../../../models/event-definition';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  spaces: Space[];

  types: { id: EventDefinitionType, name: string }[];
  views: { id: EventDefinitionView, name: string }[];

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
      title: ['', Validators.compose([CoreValidator.notEmpty, Validators.maxLength(100)])],

      view: [null, Validators.required],
      type: [null, Validators.required],

      in_chooser: [true, Validators.required],

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

      residents: [true, Validators.required],
      users: [true, Validators.required],
      duration: [true, Validators.required],
      repeats: [true, Validators.required],
      rsvp: [true, Validators.required],

      done: [true, Validators.required]
    });

    this.types = [
      { id: EventDefinitionType.NONE, name: 'None'},
      { id: EventDefinitionType.ABSENCE, name: 'Absence'}
    ];

    this.views = [
      { id: EventDefinitionView.RESIDENT, name: 'Resident'},
      { id: EventDefinitionView.FACILITY, name: 'Facility'},
      { id: EventDefinitionView.CORPORATE, name: 'Corporate'}
    ];

    this.form.get('ffc').disable();
    this.form.get('ihc').disable();
    this.form.get('il').disable();
    this.form.get('physician').disable();
    this.form.get('physician_optional').disable();
    this.form.get('responsible_person').disable();
    this.form.get('responsible_person_optional').disable();
    this.form.get('responsible_person_multi').disable();
    this.form.get('responsible_person_multi_optional').disable();
    this.form.get('additional_date').disable();

    this.form.get('residents').disable();
    this.form.get('users').disable();
    this.form.get('duration').disable();
    this.form.get('repeats').disable();
    this.form.get('rsvp').disable();
    this.form.get('done').disable();

    this.subscribe('vc_view');
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
      case 'vc_view':
        this.$subscriptions[key] = this.form.get('view').valueChanges.subscribe(res => {
          if (res) {
            switch (res) {
              case EventDefinitionView.RESIDENT:
                this.form.get('ffc').enable();
                this.form.get('ihc').enable();
                this.form.get('il').enable();
                this.form.get('physician').enable();
                this.form.get('physician_optional').enable();
                this.form.get('responsible_person').enable();
                this.form.get('responsible_person_optional').enable();
                this.form.get('responsible_person_multi').enable();
                this.form.get('responsible_person_multi_optional').enable();
                this.form.get('additional_date').enable();

                this.form.get('residents').disable();
                this.form.get('users').disable();
                this.form.get('duration').disable();
                this.form.get('repeats').disable();
                this.form.get('rsvp').disable();
                this.form.get('done').disable();
                break;
              case EventDefinitionView.FACILITY:
                this.form.get('residents').enable();
                this.form.get('users').enable();
                this.form.get('duration').enable();
                this.form.get('repeats').enable();
                this.form.get('rsvp').enable();

                this.form.get('ffc').disable();
                this.form.get('ihc').disable();
                this.form.get('il').disable();
                this.form.get('physician').disable();
                this.form.get('physician_optional').disable();
                this.form.get('responsible_person').disable();
                this.form.get('responsible_person_optional').disable();
                this.form.get('responsible_person_multi').disable();
                this.form.get('responsible_person_multi_optional').disable();
                this.form.get('additional_date').disable();
                break;
              case EventDefinitionView.CORPORATE:
                this.form.get('residents').disable();

                this.form.get('users').enable();
                this.form.get('duration').enable();
                this.form.get('repeats').enable();
                this.form.get('rsvp').enable();

                this.form.get('ffc').disable();
                this.form.get('ihc').disable();
                this.form.get('il').disable();
                this.form.get('physician').disable();
                this.form.get('physician_optional').disable();
                this.form.get('responsible_person').disable();
                this.form.get('responsible_person_optional').disable();
                this.form.get('responsible_person_multi').disable();
                this.form.get('responsible_person_multi_optional').disable();
                this.form.get('additional_date').disable();

                this.form.get('done').enable();
                break;
            }
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
