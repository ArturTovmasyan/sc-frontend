import {Router} from '@angular/router';
import {Component, ElementRef, OnInit} from '@angular/core';
import {first} from 'rxjs/operators';
import {ResidentService} from '../../../../services/resident.service';
import {Resident} from '../../../../models/resident';
import {GroupType} from '../../../../models/group-type.enum';
import {Observable} from 'rxjs';
import {AbstractForm} from '../../../../../../shared/components/abstract-form/abstract-form';
import {FormComponent} from '../form/form.component';
import {NzModalService, simpleEmptyImage} from 'ng-zorro-antd';
import {ImageEditorComponent} from './img-editor/image-editor.component';
import {ResidentSelectorService} from '../../../../services/resident-selector.service';
import {DomSanitizer} from '@angular/platform-browser';
import {ResidentAdmission} from '../../../../models/resident-admission';
import {ResidentAdmissionService} from '../../../../services/resident-admission.service';

@Component({
  selector: 'app-resident-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  GroupType = GroupType;
  defaultSvg = this.sanitizer.bypassSecurityTrustResourceUrl(simpleEmptyImage);

  resident: Resident;
  admission: ResidentAdmission;

  today: Date = new Date();

  loading: boolean;
  protected loading_edit_modal: boolean = false;

  resident_id: number;

  constructor(
    private el: ElementRef,
    private sanitizer: DomSanitizer,
    private resident$: ResidentService,
    private admission$: ResidentAdmissionService,
    protected modal$: NzModalService,
    private router$: Router,
    private residentSelector$: ResidentSelectorService
  ) {
  }

  ngOnInit(): void {
    this.loading = true;

    this.residentSelector$.resident.subscribe(next => {
      if (next) {
        this.resident_id = next;

        this.resident$.get(this.resident_id).pipe(first()).subscribe(res => {
          this.loading = false;
          if (res) {
            this.resident = res;
          } else {
            this.resident = null;
          }
        }, error => {
          this.loading = false;
          this.resident = null;
        });

        this.admission$.active(this.resident_id).pipe(first()).subscribe(res => {
          if (res != null && !Array.isArray(res)) {
            this.admission = res;

            let group_id = null;
            if (this.admission.group_type) {
              switch (this.admission.group_type) {
                case GroupType.FACILITY:
                  group_id = this.admission.facility_bed.room.facility.id;
                  break;
                case GroupType.REGION:
                  group_id = this.admission.region.id;
                  break;
                case GroupType.APARTMENT:
                  group_id = this.admission.apartment_bed.room.apartment.id;
                  break;
              }
            }

            this.residentSelector$.type.next(this.admission.group_type);
            this.residentSelector$.group.next(group_id);
          } else {
            this.admission = null;
            this.residentSelector$.type.next(null);
            this.residentSelector$.group.next(null);
          }
        }, error => {
          this.admission = null;
        });
      }
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
                  this.router$.navigate(
                    ['/resident', res[0], {outlets: {'resident-details': ['responsible-persons']}}]
                  );
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

}
