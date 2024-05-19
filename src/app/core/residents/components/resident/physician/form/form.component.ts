import * as _ from 'lodash';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../../shared/components/abstract-form/abstract-form';
import {Physician} from '../../../../models/physician';
import {PhysicianService} from '../../../../services/physician.service';
import {ResidentPhysicianService} from '../../../../services/resident-physician.service';
import {ResidentSelectorService} from '../../../../services/resident-selector.service';
import {ModalFormService} from '../../../../../../shared/services/modal-form.service';
import {NzModalService} from 'ng-zorro-antd';
import {FormComponent as PhysicianFormComponent} from '../../../physician/form/form.component';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  physicians: Physician[];

  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder,
    private physician$: PhysicianService,
    private resident_physician$: ResidentPhysicianService,
    private residentSelector$: ResidentSelectorService,
    private nzModal$: NzModalService
  ) {
    super(modal$);
    this.modal_map = [
         {key: 'physician', component: PhysicianFormComponent}
    ];
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],

      physician_id: [null, Validators.required],
      primary: [false, Validators.required],

      resident_id: [null, Validators.required]
    });

    this.subscribe('rs_resident');
    this.subscribe('list_physician');
    this.subscribe('vc_primary');
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'vc_primary':
        this.$subscriptions[key] = this.form.get('primary').valueChanges.subscribe(next => {
          this.resident_physician$.get_primary(this.form.get('resident_id').value).subscribe(res => {
            if (res) {
              if (!(_.isArray(res) && _.size(res) === 0)) {
                if (res.id !== this.form.get('id').value && next) {
                  this.show_modal_confirm(next,
                    `<i class="fa fa-info text-info"></i>
                    Another Physician was assigned as Primary.<br/>
                    Would you like to change the Primary role to this Physician?`);
                } else if (res.id === this.form.get('id').value && !next) {
                  this.show_modal_confirm(next,
                    `<i class="fa fa-warning text-warning"></i>
                    This Physician was assigned as Primary.<br/>
                    Would you like to change the Primary role of this Physician?`);
                }
              }
            }
          });
        });
        break;
      case 'list_physician':
        this.$subscriptions[key] = this.physician$.all(/** TODO: by space **/).pipe(first()).subscribe(res => {
          if (res) {
            this.physicians = res;

            if (params) {
              this.form.get('physician_id').setValue(params.physician_id);
            }
          }
        });
        break;
      case 'rs_resident':
        this.$subscriptions[key] = this.residentSelector$.resident.subscribe(next => {
          if (next) {
            this.form.get('resident_id').setValue(next);
          }
        });
        break;
      default:
        break;
    }
  }

  show_modal_confirm(next: boolean, message: string): void {
    const modal = this.nzModal$.create({
      nzClosable: false,
      nzMaskClosable: false,
      nzTitle: null,
      nzContent: `<p class="modal-confirm text-center">${message}</p>`,
      nzFooter: [
        {
          label: 'No',
          onClick: () => {
            this.unsubscribe('vc_primary');
            this.form.get('primary').setValue(!next);
            this.subscribe('vc_primary');
            modal.close();
          }
        },
        {
          type: 'primary',
          label: 'Yes',
          onClick: () => {
            modal.close();
          }
        }
      ]
    });
  }
}
