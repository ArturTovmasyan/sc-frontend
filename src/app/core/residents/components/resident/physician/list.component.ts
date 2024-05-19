import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../../services/title.service';
import {ResidentPhysicianService} from '../../../services/resident-physician.service';
import {ResidentPhysician} from '../../../models/resident-physician';
import {FormComponent} from './form/form.component';
import {Observable} from 'rxjs';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {ResidentSelectorService} from '../../../services/resident-selector.service';
import {first} from 'rxjs/operators';

@Component({
  templateUrl: './list.component.html',
  providers: [ResidentPhysicianService]
})
export class ListComponent implements OnInit {
  physicians: ResidentPhysician[];

  selected_tab: number;

  loading_edit_modal: boolean;

  constructor(
    private service$: ResidentPhysicianService,
    private title$: TitleService,
    private modal$: NzModalService,
    private route$: ActivatedRoute,
    private residentSelector$: ResidentSelectorService,
  ) {
    this.selected_tab = 0;
  }

  ngOnInit(): void {
    this.residentSelector$.resident.subscribe(next => {
      this.reload_data();
    });
  }

  reload_data(id?: number) {
    this.service$.all([{key: 'resident_id', value: `${this.residentSelector$.resident.value}`}])
      .pipe(first()).subscribe(next => {
      if (next) {
        this.physicians = next;

        if (id) {
          this.selected_tab = this.physicians.findIndex(v => v === this.physicians.find(value => value.id === id));
        }
      }
    });
  }

  show_modal_add(): void {
    this.create_modal(FormComponent, data => this.service$.add(data), null);
  }

  show_modal_edit(): void {
    this.loading_edit_modal = true;
    this.service$.get(this.physicians[this.selected_tab].id).subscribe(
      res => {
        this.loading_edit_modal = false;

        this.create_modal(FormComponent, data => this.service$.edit(data), res);
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
              this.service$.removeBulk([this.physicians[this.selected_tab].id]).subscribe(
                res => {
                  loading = false;
                  this.reload_data();
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

  private create_modal(form_component: any, submit: (data: any) => Observable<any>, result: any) {
    let valid = false;
    let loading = false;

    const footer = [
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

          const component = <AbstractForm>modal.getContentComponent();
          component.before_submit();
          const form_data = component.formObject.value;

          component.submitted = true;

          submit(form_data).subscribe(
            res => {
              loading = false;

              if (res != null && Array.isArray(res) && res.length === 1) {
                this.reload_data(res[0]);
              } else {
                this.reload_data();
              }

              modal.close();
            },
            error => {
              loading = false;

              component.handleSubmitError(error);
              component.postSubmit(null);
              // console.error(error);
            });
        }
      },
    ];

    if (result === null) {
      footer.push({
        type: 'primary',
        label: 'Save & Add',
        loading: () => loading,
        disabled: () => !valid,
        onClick: () => {
          loading = true;

          const component = <AbstractForm>modal.getContentComponent();
          component.before_submit();
          const form_data = component.formObject.value;

          component.submitted = true;

          submit(form_data).subscribe(
            res => {
              loading = false;

              if (res != null && Array.isArray(res) && res.length === 1) {
                this.reload_data(res[0]);
              } else {
                this.reload_data();
              }

              modal.close();

              this.create_modal(form_component, submit, result);
            },
            error => {
              loading = false;

              component.handleSubmitError(error);
              component.postSubmit(null);
              // console.error(error);
            });
        }
      });
    }

    const modal = this.modal$.create({
      nzClosable: false,
      nzMaskClosable: false,
      nzTitle: null,
      nzContent: form_component,
      nzFooter: footer
    });

    modal.afterOpen.subscribe(() => {
      const component = modal.getContentComponent();
      if (component instanceof FormComponent) {
        const form = component.formObject;

        if (result !== null) {
          component.loaded.subscribe(v => {
            if (v) {
              component.before_set_form_data(result);
              component.set_form_data(component, form, result);
              component.after_set_form_data();
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
}
