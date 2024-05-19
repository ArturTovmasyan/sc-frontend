import * as _ from 'lodash';
import {OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {TitleService} from '../../../core/services/title.service';
import {NzModalService} from 'ng-zorro-antd';
import {AbstractForm} from '../abstract-form/abstract-form';
import {GridService} from '../../services/grid.service';
import {FormGroup} from '@angular/forms';

// @Component({
//   templateUrl: './grid.component.html',
//   styleUrls: ['./grid.component.scss']
// })
export class GridComponent<T extends IdInterface, Service extends GridService<T>>
  implements OnInit {
  protected loading = false;

  protected page_config = {
    page: 1,
    per_page: 10,
    total: 0
  };

  protected checkbox_config = {
    all: false,
    indeterminate: false,
    data: [],
    ids: []
  };

  protected fields = null;
  protected data = [];

  protected title: string = null;
  protected name: string = null;

  protected component: any;

  private filter: { [id: string]: { condition: number, value: any[] } } = {};
  private sort: { key: string, value: string }[] = [];

  constructor(protected service$: Service, protected title$: TitleService, protected modal$: NzModalService) {
    title$.getTitle().subscribe(v => this.title = v);
  }

  ngOnInit(): void {
    this.load_grid_fields().subscribe((data: any) => {
      this.fields = data;
      this.fields.forEach(
        field => {
          this.filter[field.id] = {condition: null, value: null};

          switch (field.type) {
            case 'enum':
              field.enum = [];
              Object.entries(field.values).forEach(
                ([key, value]) => {
                  field.enum.push({label: key, value: value});
                }
              );

              this.filter[field.id].value = new Array(1);
              break;
            case 'string':
              this.filter[field.id].value = new Array(1);
              break;
            case 'date':
            case 'number':
              this.filter[field.id].value = new Array(2);
              break;
          }
        }
      );

      this.reload_data();
    });
  }

  update_filter(field: any): void {
    let update_flag = true;
    if (field.type === 'enum') {
      const clone_filter = _.cloneDeep(this.filter);
      const value = field.enum.filter(v => (v.hasOwnProperty('checked') && v.checked === true)).map(v => v.value);
      this.filter[field.id].value = value.length > 0 ? value : [null];
      update_flag = JSON.stringify(clone_filter) !== JSON.stringify(this.filter);
    }

    if (update_flag) {
      this.reload_data(true);
      this.checkbox_refresh();
    }
  }

  reset_filter(field: any) {
    const clone_filter = _.cloneDeep(this.filter);

    if (field.type === 'enum') {
      field.enum.forEach(v => {
        v.checked = false;
      });
    }

    this.filter[field.id].condition = null;
    for (let i = 0; i < this.filter[field.id].value.length; i++) {
      this.filter[field.id].value[i] = null;
    }

    if (JSON.stringify(clone_filter) !== JSON.stringify(this.filter)) {
      this.reload_data(true);
      this.checkbox_refresh();
    }
  }

  update_sort(sort: { key: string, value: string }): void {
    const index = this.sort.map(e => e.key).indexOf(sort.key);

    if (index !== -1) {
      this.sort.splice(index, 1);
    }

    if (sort.value !== null) {
      this.sort.push(sort);
    }

    this.reload_data();
    this.checkbox_refresh();
  }

  current_page_data_change($event: Array<any>): void {
    this.checkbox_config.data = $event;
    this.checkbox_refresh();
  }

  checkbox_all(value: boolean): void {
    this.checkbox_config.data.forEach(data => {
      if (!data.disabled) {
        data.checked = value;
      }
    });
    this.checkbox_refresh();
  }

  checkbox_refresh(): void {
    const allChecked = this.checkbox_config.data.filter(value => !value.disabled)
      .every(value => value.checked === true);
    const allUnChecked = this.checkbox_config.data.filter(value => !value.disabled)
      .every(value => !value.checked);
    this.checkbox_config.all = allChecked;
    this.checkbox_config.indeterminate = (!allChecked) && (!allUnChecked);

    this.checkbox_config.ids = this.checkbox_config.data.filter(v => v.checked).map(v => v.id);
  }

  reload_data(reset: boolean = false): void {
    if (reset) {
      this.page_config.page = 1;
    }

    this.loading = true;

    this.load_grid(this.page_config.page, this.page_config.per_page, this.sort, this.filter).subscribe((data: any) => {
      this.loading = false;

      this.page_config.total = data.total;
      this.data = data.data;
    });
  }

  download_pdf() {
    this.loading = true;
    this.load_pdf(() => {
      this.loading = false;
    });
  }

  show_modal_add(): void {
    this.create_modal(data => this.add_data(data), null);
  }

  show_modal_edit(): void {
    this.load_data(this.checkbox_config.ids[0]).subscribe(
      res => {
        this.create_modal(data => this.edit_data(data), res);
      },
      error => {
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
              this.remove_data(this.checkbox_config.ids).subscribe(
                res => {
                  loading = false;

                  this.reload_data();
                  this.checkbox_refresh();

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
      nzContent: this.component,
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

            const component = <AbstractForm> modal.getContentComponent();
            const form_data = component.formObject.getRawValue();

            component.submitted = true;

            submit(form_data).subscribe(
              res => {
                loading = false;

                this.reload_data();
                this.checkbox_refresh();

                modal.close();
              },
              error => {
                loading = false;

                component.handleSubmitError(error);

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

        if (result !== null) {
          this.set_form_data(form, result);
        }

        valid = form.valid;
        form.valueChanges.subscribe(val => {
          valid = form.valid;
        });
      }
    });
  }

  protected load_grid_fields() {
    return this.service$.options();
  }

  protected load_grid(page: number,
                      per_page: number,
                      sort: { key: string, value: string }[],
                      filter: { [id: string]: { condition: number, value: any[] } }) {
    return this.service$.list(page, per_page, sort, filter);
  }

  protected load_pdf(callback: any) {
    return this.service$.pdf(callback);
  }

  protected load_data(id: number) {
    return this.service$.get(id);
  }

  protected add_data(data: T) {
    return this.service$.add(data);
  }

  protected edit_data(data: T) {
    return this.service$.edit(data);
  }

  protected remove_data(ids: number[]) {
    return this.service$.removeBulk(ids);
  }

  protected set_form_data(form: FormGroup, result: any) {
    const form_controls = Object.keys(form.controls);
    const data = result;

    Object.keys(data).forEach((key) => {
      if (form_controls.includes(key) === false && form_controls.includes(key + '_id') === false) {
        delete data[key];
      } else if (form_controls.includes(key + '_id')) {
        data[key + '_id'] = data[key] ? data[key].id : null;
        delete data[key];
      } else if (data[key] instanceof Array) {
        if (data[key].length > 0 && data[key][0] != null && data[key][0].hasOwnProperty('id')) {
          data[key] = data[key].map(v => v.id);
        }
      }
    });

    form.setValue(data);
  }
}
