﻿import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {CityStateZipService} from '../../../services/city-state-zip.service';
import {SpaceService} from '../../../../services/space.service';
import {Space} from '../../../../models/space';
import {CityStateZip} from '../../../models/city-state-zip';
import {CoreValidator} from '../../../../../shared/utils/core-validator';
import {FormComponent as CSZFormComponent} from '../../city-state-zip/form/form.component';
import {NzModalService} from 'ng-zorro-antd';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  city_state_zips: CityStateZip[];
  spaces: Space[];

  constructor(
    private formBuilder: FormBuilder,
    private city_state_zip$: CityStateZipService,
    private space$: SpaceService,
    private modal$: NzModalService
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      name: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      shorthand: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      description: ['', Validators.compose([Validators.maxLength(1000)])],
      phone: ['', CoreValidator.phone],
      fax: ['', CoreValidator.phone],
      license: ['', Validators.compose([Validators.maxLength(20)])],
      license_capacity: ['', Validators.compose([Validators.required, CoreValidator.group_capacity])],
      capacity: ['', Validators.compose([Validators.required, CoreValidator.group_capacity])],
      address: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      csz_id: [null, Validators.required],
      space_id: [null, Validators.required],
    });

    this.subscribe('list_csz');
    this.subscribe('list_space');
  }

  protected subscribe(key: string): void {
    switch (key) {
      case 'list_space':
        this.$subscriptions[key] = this.space$.all().pipe(first()).subscribe(res => {
          if (res) {
            res.sort((a, b) => a.name.localeCompare(b.name));
            this.spaces = res;
          }
        });
        break;
      case 'list_csz':
        this.$subscriptions[key] = this.city_state_zip$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.city_state_zips = res;
          }
        });
        break;
      default:
        break;
    }
  }

  public open_sub_modal(key: string): void {
    switch (key) {
      case 'csz':
        this.create_modal(
          this.modal$,
          CSZFormComponent,
          data => this.city_state_zip$.add(data),
          data => {
            this.$subscriptions[key] = this.city_state_zip$.all(/** TODO: by space **/).pipe(first()).subscribe(res => {
              if (res) {
                this.city_state_zips = res;
                this.form.get('csz_id').setValue(data[0]);
              }
            });
            return null;
          });
        break;
      default:
        break;
    }
  }
}
