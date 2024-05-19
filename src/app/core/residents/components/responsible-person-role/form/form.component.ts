import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {Space} from '../../../../models/space';
import {SpaceService} from '../../../../services/space.service';
import {first} from 'rxjs/operators';
import {AuthGuard} from '../../../../guards/auth.guard';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  spaces: Space[];

  iconPicked: string = null;

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
      title: ['', Validators.compose([Validators.required, Validators.maxLength(255)])],
      icon: ['', Validators.compose([Validators.maxLength(255)])],
      emergency: [false, Validators.required],
      financially: [false, Validators.required],
    });

    this.add_space();

    this.subscribe('vc_icon');
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
      case 'vc_icon':
        this.$subscriptions[key] = this.form.get('icon').valueChanges.subscribe(next => {
          if (next) {
            this.iconPicked = next;
          }
        });
        break;
      default:
        break;
    }
  }

  public onIconPickerSelect($event): void {
    if (this.iconPicked !== null) {
      this.form.get('icon').setValue($event);
    }
  }

  public check() {
    this.iconPicked = '';
  }
}
