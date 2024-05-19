import {ActivatedRoute} from '@angular/router';
import {Component, ElementRef, OnInit} from '@angular/core';
import {first} from 'rxjs/operators';
import {ResidentService} from '../../../services/resident.service';
import {Resident} from '../../../models/resident';
import {ResidentType} from '../../../models/resident-type.enum';
import {Observable} from 'rxjs';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {FormComponent} from '../form/form.component';
import {NzModalService} from 'ng-zorro-antd';
import {FormArray, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-resident-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  ResidentType = ResidentType;

  resident: Resident;

  today: Date = new Date();

  loading: boolean;
  protected loading_edit_modal: boolean = false;


  resident_id: number;

  constructor(private el: ElementRef, private resident$: ResidentService, protected modal$: NzModalService, private route$: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.loading = true;

    this.route$.params.subscribe(params => {
      this.resident_id = +params['id'];

      this.resident$.get(this.resident_id).pipe(first()).subscribe(res => {
        this.loading = false;
        if (res) {
          this.resident = res;
        }
      });
    });
  }

  show_modal_add(): void {
    this.create_modal(data => this.resident$.add(data), null);
  }

  show_modal_edit(): void {
    this.loading_edit_modal = true;
    this.resident$.get(this.resident_id).subscribe(
      res => {
        this.loading_edit_modal = false;

        this.create_modal(data => this.resident$.edit(data), res);
      },
      error => {
        this.loading_edit_modal = false;
        // console.error(error);
      });
  }

  show_modal_remove(): void {
    let loading = false;
    const modal = this.modal$.create({
        nzClosable: false,
        nzMaskClosable: false,
        nzTitle: null,
        nzContent: `<p class="modal-confirm">
                    <i class="fa fa-warning text-danger"></i>
                     Are you sure you want to <strong>delete</strong> selected record(s)?
                     </p>`,
        nzFooter: [
          {
            label: 'No',
            onClick: () => {
              modal.close();
            }
          },
          {
            type: 'danger',
            label: 'Yes',
            loading: () => loading,
            onClick: () => {
              loading = true;
              this.resident$.removeBulk([this.resident_id]).subscribe(
                res => {
                  loading = false;

                  modal.close();
                },
                error => {
                  loading = false;
                  modal.close();

                  this.modal$.error({
                    nzTitle: 'Remove Error',
                    nzContent: `${error.data.error}`
                  });

                  // console.error(error);
                });
            }
          }
        ]
      })
    ;
  }

  private create_modal(submit: (data: any) => Observable<any>, result: any) {
    let valid = false;
    let loading = false;

    const modal = this.modal$.create({
      nzClosable: false,
      nzMaskClosable: false,
      nzTitle: null,
      nzContent: FormComponent,
      nzFooter: [
        {
          label: 'Cancel',
          onClick: () => {
            modal.close();
          }
        },
        {
          type: 'primary',
          label: 'Save',
          loading: () => loading,
          disabled: () => !valid,
          onClick: () => {
            loading = true;

            const component = <FormComponent>modal.getContentComponent();
            const form_data = component.formObject.value;

            component.submitted = true;

            submit(form_data).subscribe(
              res => {
                loading = false;

                // TODO(haykg): review add case
                this.loading = false;
                this.resident$.get(this.resident_id).pipe(first()).subscribe(resident => {
                  this.loading = false;
                  if (resident) {
                    this.resident = resident;
                  }
                });

                modal.close();
              },
              error => {
                loading = false;

                component.handleSubmitError(error);
                component.postSubmit(null);
                // console.error(error);
              });
          }
        }
      ]
    });

    modal.afterOpen.subscribe(() => {
      const component = modal.getContentComponent();
      if (component instanceof AbstractForm) {
        const form = component.formObject;

        component.type = this.resident.type;
        component.init_subform();

        if (result !== null) {
          component.loaded.subscribe(v => {
            if (v) {
              this.set_form_data(component, form, result);
            }
          });
        }

        valid = form.valid;
        form.valueChanges.subscribe(val => {
          valid = form.valid;
        });
      }
    });
  }

  protected set_form_data(component: AbstractForm, form: FormGroup, result: any) {
    const form_controls = Object.keys(form.controls);
    const data = result;

    Object.keys(data).forEach((key) => {
      if (form_controls.includes(key) === false && form_controls.includes(key + '_id') === false) {
        // console.log('NF', key);
        delete data[key];
      } else if (form_controls.includes(key + '_id')) {
        // console.log('ID', key);
        data[key + '_id'] = data[key] ? data[key].id : null;
        delete data[key];

        form.get(key + '_id').setValue(data[key + '_id']);
      } else if ((data[key] instanceof Array) && !(form.get(key) instanceof FormArray)) {
        // console.log('AR', key);
        if (data[key].length > 0 && data[key][0] != null && data[key][0].hasOwnProperty('id')) {
          data[key] = data[key].map(v => v.id);
        }
        form.get(key).setValue(data[key]);
      } else if ((data[key] instanceof Array) && (form.get(key) instanceof FormArray)) {
        // console.log('FA', key);
        // console.log('FA', data[key]);

        const form_array = <FormArray>form.get(key);

        form_array.controls = [];
        for (let i = 0; i < data[key].length; i++) {
          const skeleton = component.get_form_array_skeleton(key);
          if (skeleton instanceof FormGroup) {
            // skeleton.setValue(data[key]);
            this.set_form_data(component, skeleton, data[key][i]);
            form_array.push(skeleton);
          }
        }

        delete data[key];
      } else if (form.get(key) instanceof FormGroup) {
        // console.log('FG', key);
        this.set_form_data(component, <FormGroup>form.get(key), data[key]);

        delete data[key];
      } else {
        // console.log('ELSE', key);
        if (form.get(key) !== null) {
          form.get(key).setValue(data[key]);
        }
      }
    });
  }
}
