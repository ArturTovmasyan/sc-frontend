import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../../shared/components/abstract-form/abstract-form';
import {Physician} from '../../../../models/physician';
import {PhysicianService} from '../../../../services/physician.service';
import {ActivatedRoute} from '@angular/router';
import {ResidentPhysicianService} from '../../../../services/resident-physician.service';
import {Subscription} from 'rxjs';
import {NzModalService} from 'ng-zorro-antd';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit, OnDestroy {
  physicians: Physician[];
  resident_id: number;

  private $subscriptions: { [key: string]: Subscription; };

  constructor(
    private formBuilder: FormBuilder,
    private physician$: PhysicianService,
    private resident_physician$: ResidentPhysicianService,
    private modal$: NzModalService,
    private route$: ActivatedRoute
  ) {
    super();

    this.$subscriptions = {};
  }

  ngOnInit(): void {
    this.resident_id = +this.route$.snapshot.firstChild.firstChild.params['id']; // TODO: review

    this.form = this.formBuilder.group({
      id: [''],
      physician_id: [null, Validators.required],
      primary: [false, Validators.required],

      resident_id: [this.resident_id, Validators.required]
    });

    this.physician$.all(/** TODO: by space **/).pipe(first()).subscribe(res => {
      if (res) {
        this.physicians = res;
      }
    });

    this.resubscribe('vc_primary');
  }

  ngOnDestroy(): void {
    Object.keys(this.$subscriptions).forEach(key => this.$subscriptions[key].unsubscribe());
  }

  unsubscribe(key: string): void {
    if (this.$subscriptions.hasOwnProperty(key)) {
      this.$subscriptions[key].unsubscribe();
    }
  }

  resubscribe(key: string): void {
    switch (key) {
      case 'vc_primary':
        this.$subscriptions['vc_primary'] = this.form.get('primary').valueChanges.subscribe(next => {
          this.resident_physician$.get_primary(this.resident_id).subscribe(res => {
            if (res) {
              if (res.id !== this.form.get('id').value && next) {
                this.show_modal_confirm(next,
                  '<i class="fa fa-info text-info"></i>' +
                  'A Primary Physician was already assigned.<br/>' +
                  'Would you like to change the Primary role to this Physician?');
              } else if (res.id === this.form.get('id').value && !next) {
                this.show_modal_confirm(next,
                  '<i class="fa fa-warning text-warning"></i>' +
                  'This Physician was assigned as Primary.<br/>' +
                  'Would you like to change the Primary role of this Physician?');
              }
            }
          });
        });
        break;
      default:
        break;
    }
  }

  show_modal_confirm(next: boolean, message: string): void {
    const modal = this.modal$.create({
      nzClosable: false,
      nzMaskClosable: false,
      nzTitle: null,
      nzContent: `<p class="modal-confirm">${message}</p>`,
      nzFooter: [
        {
          label: 'No',
          onClick: () => {
            this.unsubscribe('vc_primary');
            this.form.get('primary').setValue(!next);
            this.resubscribe('vc_primary');
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
