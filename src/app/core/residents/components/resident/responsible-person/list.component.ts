import * as _ from 'lodash';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {NzModalService, simpleEmptyImage} from 'ng-zorro-antd';
import {TitleService} from '../../../../services/title.service';
import {ResidentResponsiblePersonService} from '../../../services/resident-responsible-person.service';
import {ResidentResponsiblePerson} from '../../../models/resident-responsible-person';
import {FormComponent} from './form/form.component';
import {FormComponent as ReorderFormComponent} from './reorder/form.component';
import {FormComponent as ResponsiblePersonFormComponent} from '../../responsible-person/form/form.component';
import {Observable, Subscription} from 'rxjs';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {ResidentSelectorService} from '../../../services/resident-selector.service';
import {first} from 'rxjs/operators';
import {DomSanitizer} from '@angular/platform-browser';
import {ResponsiblePersonService} from '../../../services/responsible-person.service';
import {AuthGuard} from '../../../../guards/auth.guard';

@Component({
  templateUrl: './list.component.html',
  providers: [ResidentResponsiblePersonService]
})
export class ListComponent implements OnInit, OnDestroy {
  responsible_persons: ResidentResponsiblePerson[];

  selected_tab: number;

  loading_edit_modal: boolean;
  loading_rp_edit_modal: boolean;

  defaultSvg = this.sanitizer.bypassSecurityTrustResourceUrl(simpleEmptyImage);

  private $subscriptions: { [key: string]: Subscription; };

  constructor(
    private service$: ResidentResponsiblePersonService,
    private title$: TitleService,
    private modal$: NzModalService,
    private residentSelector$: ResidentSelectorService,
    private responsiblePerson$: ResponsiblePersonService,
    private sanitizer: DomSanitizer,
    private auth_$: AuthGuard
  ) {
    this.selected_tab = 0;
    this.$subscriptions = {};
  }

  ngOnInit(): void {
    this.subscribe('resident_id');
  }

  ngOnDestroy(): void {
    Object.keys(this.$subscriptions).forEach(key => this.$subscriptions[key].unsubscribe());
  }

  unsubscribe(key: string): void {
    if (this.$subscriptions.hasOwnProperty(key)) {
      this.$subscriptions[key].unsubscribe();
    }
  }

  subscribe(key: string) {
    this.unsubscribe(key);
    switch (key) {
      case 'resident_id':
        this.$subscriptions[key] = this.residentSelector$.resident.subscribe(next => {
          if (next) {
            this.reload_data();
          }
        });
        break;
      default:
        break;
    }
  }

  reload_data(id?: number) {
    this.service$.all([{key: 'resident_id', value: `${this.residentSelector$.resident.value}`}])
      .pipe(first()).subscribe(next => {
      if (next) {
        this.responsible_persons = next;

        if (id) {
          this.selected_tab = this.responsible_persons.findIndex(v => v === this.responsible_persons.find(value => value.id === id));
        }
      }
    });
  }

  show_modal_reorder(): void {
    this.service$.all([{key: 'resident_id', value: `${this.residentSelector$.resident.value}`}])
      .pipe(first()).subscribe(next => {
      if (next) {
        this.create_modal(ReorderFormComponent, data => this.service$.reorder(data), {
          responsible_persons: next
        });
      }
    });
  }

  show_modal_add(): void {
    this.create_modal(FormComponent, data => this.service$.add(data), null);
  }

  show_rp_edit(id: number): void {
    this.loading_rp_edit_modal = true;
    this.responsiblePerson$.get(id).subscribe(
      res => {
        this.loading_rp_edit_modal = false;

        this.create_modal(ResponsiblePersonFormComponent, data => this.responsiblePerson$.edit(data), res);
      },
      error => {
        this.loading_rp_edit_modal = false;
        // console.error(error);
      });
  }

  show_modal_edit(): void {
    this.loading_edit_modal = true;
    this.service$.get(this.responsible_persons[this.selected_tab].id).subscribe(
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
    this.service$.relatedInfo([this.responsible_persons[this.selected_tab].id]).subscribe(value => {
      if (value) {
        let modal_title = '';
        let modal_message = '';

        if (_.isArray(value) && value.length > 0) {
          value = Object.keys(value[0])
            .reduce((previousValue, currentValue, currentIndex) => (previousValue + value[0][currentValue].sum), 0);

          if (value > 0) {
            modal_title = 'Attention!';
            modal_message = `This may cause other data loss from database. There are ${value} connections found in database.`;
          }
        }

        const modal = this.modal$.create({
          nzClosable: false,
          nzMaskClosable: false,
          nzTitle: null,
          nzContent: `<p class="modal-confirm text-center">
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
                this.service$.removeBulk([this.responsible_persons[this.selected_tab].id]).subscribe(
                  res => {
                    loading = false;
                    this.selected_tab = 0;
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
        });
      }
    });
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
      nzWidth: '45rem',
      nzTitle: null,
      nzContent: form_component,
      nzFooter: footer
    });

    modal.afterOpen.subscribe(() => {
      const component = modal.getContentComponent();
      if (component instanceof FormComponent
        || component instanceof ResponsiblePersonFormComponent
        || component instanceof ReorderFormComponent) {
        const form = component.formObject;

        if (component instanceof ReorderFormComponent) {
          component.resident_responsible_persons = this.responsible_persons;
        }

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

  addIfHasPermission(permission: string, level: number) {
    return this.auth_$.checkPermission([permission], level, true);
  }
}
