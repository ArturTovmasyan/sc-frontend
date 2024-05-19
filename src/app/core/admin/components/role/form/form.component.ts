import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {PermissionService} from '../../../../services/permission.service';
import {SpaceService} from '../../../../services/space.service';
import {Permission} from '../../../../models/permission';
import {Space} from '../../../../models/space';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  permissions: Permission[];
  spaces: Space[];

  constructor(private formBuilder: FormBuilder, private permission$: PermissionService, private space$: SpaceService) {
    super();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      default: [true, Validators.required],
      space_id: [null],
      space_default: [true, Validators.required],
      permissions: [[], Validators.required]
    });

    this.permission$.all().pipe(first()).subscribe(res => {
      if (res) {
        res.sort((a, b) => a.name.localeCompare(b.name));
        this.permissions = res;
      }
    });

    this.space$.all().pipe(first()).subscribe(res => {
      if (res) {
        res.sort((a, b) => a.name.localeCompare(b.name));
        this.spaces = res;
      }
    });
  }

}
