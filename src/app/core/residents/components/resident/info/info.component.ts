import {ActivatedRoute, Router} from '@angular/router';
import {Component, ElementRef, OnInit} from '@angular/core';
import {first} from 'rxjs/operators';
import {ResidentService} from '../../../services/resident.service';
import {Resident} from '../../../models/resident';
import {ResidentType} from '../../../models/resident-type.enum';
import {Observable} from 'rxjs';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {FormComponent} from '../form/form.component';
import {NzModalService} from 'ng-zorro-antd';
import {ImageEditorComponent} from './img-editor/image-editor.component';
import {ResidentContractService} from '../../../services/resident-contract.service';
import {ContractOptionApartment, ContractOptionFacility, ContractOptionRegion, ResidentContract} from '../../../models/resident-contract';
import {FormComponent as ResidentMoveComponent} from '../move/form.component';
import {ResidentSelectorService} from '../../../services/resident-selector.service';

@Component({
  selector: 'app-resident-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  ResidentType = ResidentType;

  resident: Resident;
  contract: ResidentContract;

  today: Date = new Date();

  loading: boolean;
  protected loading_edit_modal: boolean = false;

  resident_id: number;

  constructor(
    private el: ElementRef,
    private resident$: ResidentService,
    private contract$: ResidentContractService,
    protected modal$: NzModalService,
    private router$: Router,
    private route$: ActivatedRoute,
    private residentSelector$: ResidentSelectorService
  ) {
  }

  ngOnInit(): void {
    this.loading = true;

    this.route$.params.subscribe(params => {
      this.resident_id = +params['id'];

      this.resident$.get(this.resident_id).pipe(first()).subscribe(res => {
        this.loading = false;
        if (res) {
          this.resident = res;
          this.residentSelector$.resident.next(this.resident.id);
        }
      });

      this.contract$.active(this.resident_id).pipe(first()).subscribe(res => {
        if (res != null && !Array.isArray(res)) {
          this.contract = res;

          this.residentSelector$.type.next(this.contract.type);

          let group_id = null;

          switch (this.contract.type) {
            case ResidentType.FACILITY:
              group_id = (<ContractOptionFacility>this.contract.option).bed.room.facility.id;
              break;
            case ResidentType.REGION:
              group_id = (<ContractOptionRegion>this.contract.option).region.id;
              break;
            case ResidentType.APARTMENT:
              group_id = (<ContractOptionApartment>this.contract.option).bed.room.apartment.id;
              break;
          }

          this.residentSelector$.type.next(this.contract.type);
          this.residentSelector$.group.next(group_id);
        } else {
          this.contract = null;
          this.residentSelector$.type.next(null);
          this.residentSelector$.group.next(null);
        }
      }, error => {
        this.contract = null;
      });
    });
  }

  show_modal_image_editor(): void {
    this.create_modal(ImageEditorComponent, data => this.resident$.put_photo(data), null);
  }

  show_modal_add(): void {
    this.create_modal(FormComponent, data => this.resident$.add(data), null);
  }

  show_modal_edit(): void {
    this.loading_edit_modal = true;
    this.resident$.get(this.resident_id).subscribe(
      res => {
        this.loading_edit_modal = false;

        this.create_modal(FormComponent, data => this.resident$.edit(data), res);
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

                  this.router$.navigate(['/residents']);

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

    const modal = this.modal$.create({
      nzClosable: false,
      nzMaskClosable: false,
      nzTitle: null,
      nzContent: form_component,
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

            const component = <AbstractForm>modal.getContentComponent();
            const form_data = component.formObject.value;

            component.submitted = true;

            submit(form_data).subscribe(
              res => {
                loading = false;

                // TODO(haykg): review add case
                if (result === null && res !== null && res.length > 0) {
                  modal.close();
                  this.router$.navigate(['/resident', res[0]]);
                } else {
                  this.loading = true;
                  this.resident$.get(this.resident_id).pipe(first()).subscribe(next => {
                    this.loading = false;
                    if (next) {
                      this.resident = next;
                      this.resident_id = this.resident.id;
                      this.residentSelector$.resident.next(this.resident.id);
                    }
                    modal.close();
                  });
                }
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
      } else if (component instanceof ImageEditorComponent) {
        const form = component.formObject;
        component.loaded.subscribe(v => {
          if (v) {
            const result_ = {
              id: this.residentSelector$.resident.value,
              photo: this.resident.photo
            };

            component.before_set_form_data(result_);
            component.set_form_data(component, form, result_);
            component.after_set_form_data();
          }
        });

        valid = form.valid;
        form.valueChanges.subscribe(val => {
          valid = form.valid;
        });
      }
    });
  }


  show_modal_move(): void {
    let valid = false;
    let loading = false;

    const modal = this.modal$.create({
      nzClosable: false,
      nzMaskClosable: false,
      nzTitle: null,
      nzContent: ResidentMoveComponent,
      nzFooter: [
        {
          label: 'Cancel',
          onClick: () => {
            modal.close();
          }
        },
        {
          type: 'primary',
          label: 'Move',
          loading: () => loading,
          disabled: () => !valid,
          onClick: () => {
            loading = true;

            const component = <AbstractForm>modal.getContentComponent();
            const form_data = component.formObject.value;
            component.submitted = true;
            component.before_submit();

            this.resident$.move(form_data).subscribe(
              res => {
                this.resident$.get(this.resident_id).pipe(first()).subscribe(next => {
                  this.loading = false;
                  if (next) {
                    this.resident = next;
                  }
                  modal.close();
                });
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
      const component = <ResidentMoveComponent>modal.getContentComponent();

      component.resident = this.resident;
      component.current_room = null;
      component.show_group = true;

      if (component instanceof AbstractForm) {
        const form = component.formObject;

        component.loaded.subscribe(v => {
          if (v) {
            const result = {
              id: this.resident.id,
              group_type: null,
              group_id: null,
              bed_id: null
            };

            component.before_set_form_data(result);
            component.set_form_data(component, form, result);
            component.after_set_form_data();
          }
        });

        valid = form.valid;
        form.valueChanges.subscribe(val => {
          valid = form.valid;
        });
      }
    });

  }
}
