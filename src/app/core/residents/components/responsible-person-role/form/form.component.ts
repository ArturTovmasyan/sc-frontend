﻿import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {Space} from '../../../../models/space';
import {SpaceService} from '../../../../services/space.service';
import {first} from 'rxjs/operators';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  spaces: Space[];

  constructor(private formBuilder: FormBuilder, private space$: SpaceService) {
    super();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      title: ['', Validators.compose([Validators.required, Validators.maxLength(255)])],
    });

    this.add_space();
  }

  private add_space() {
    this.form.addControl('space_id', new FormControl(null, [Validators.required]));
    this.subscribe('list_space');
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