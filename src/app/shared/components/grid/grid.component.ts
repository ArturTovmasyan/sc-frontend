import * as _ from 'lodash';
import {OnDestroy, TemplateRef, ViewChild} from '@angular/core';
import {KeyValue} from '@angular/common';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../core/services/title.service';
import {GridService} from '../../services/grid.service';
import {AbstractForm} from '../abstract-form/abstract-form';
import {MessageComponent} from './message.component';
import {FormGroup} from '@angular/forms';

export class GridComponent<T extends IdInterface, Service extends GridService<T>> implements OnDestroy {
  _ = _;

  @ViewChild('modalFooter') modalFooter: TemplateRef<any>;

  protected grid_options_loaded: BehaviorSubject<boolean>;

  public card: boolean = true; // TODO(haykg): review to convert Input
  public searchable: boolean = true; // TODO(haykg): review to convert Input
  protected loading_edit_modal: boolean = false;

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

  protected fields: any[] = null;
  protected button_shows = {
    add: false,
    edit: false,
    remove: false
  };

  protected data = [];

  protected title: string = null;
  protected name: string = null;

  protected buttons_left: {
    name: string,
    type: string,
    multiselect: boolean,
    free: boolean,
    nzIcon: string,
    faIcon: string,
    click: (ids: number[]) => void
  }[] = [];

  protected buttons_center: {
    name: string,
    type: string,
    multiselect: boolean,
    free: boolean,
    nzIcon: string,
    faIcon: string,
    click: (ids: number[]) => void
  }[] = [];

  protected buttons_right: {
    name: string,
    type: string,
    multiselect: boolean,
    free: boolean,
    nzIcon: string,
    faIcon: string,
    click: (ids: number[]) => void
  }[] = [];

  protected search_query: string = '';

  protected component: any;

  private filter: { [id: string]: { condition: number, value: any[] } } = {};
  private sort: { key: string, value: string }[] = [];

  protected params: { key: string, value: string }[] = [];

  protected $subscriptions: { [key: string]: Subscription; };

  protected without_save_and_add: boolean = false;

  protected modal_cancel: () => void;
  protected modal_previous: () => void;
  protected modal_next: () => void;
  protected modal_save: () => void;
  protected modal_save_add: () => void;
  protected modal_save_add_show: () => boolean;
  protected modal_previous_show: () => boolean;
  protected modal_next_show: () => boolean;
  protected modal_save_loading: () => boolean;
  protected modal_save_disabled: () => boolean;

  constructor(protected service$: Service, protected title$: TitleService, protected modal$: NzModalService) {
    this.title$.getTitle().subscribe(v => this.title = v);

    this.grid_options_loaded = new BehaviorSubject<boolean>(false);

    this.$subscriptions = {};
  }

  ngOnDestroy(): void {
    Object.keys(this.$subscriptions).forEach(key => this.$subscriptions[key].unsubscribe());
  }

  protected subscribe(key: string, params?: any): void {
  }

  protected unsubscribe(key: string): void {
    if (this.$subscriptions.hasOwnProperty(key)) {
      this.$subscriptions[key].unsubscribe();
    }
  }

  init(reset: boolean = false): void {
    this.load_grid_fields().subscribe((data: any) => {
      if (data) {
        this.button_shows = data.buttons;
        this.grid_options_loaded.next(true);

        this.fields = data.fields;
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

                field.enum_map = {};

                Object.entries(field.values).forEach(
                  ([key, value]) => {
                    Object.defineProperty(field.enum_map, <number>value, {value: key});
                  }
                );

                this.filter[field.id].value = new Array(1);
                break;
              case 'boolean':
                field.enum = [
                  {label: 'Yes', value: 1},
                  {label: 'No', value: 0}
                ];

                field.enum_map = {
                  true: 'Yes',
                  false: 'No'
                };

                this.filter[field.id].value = new Array(1);
                break;
              case 'string':
                this.filter[field.id].value = new Array(1);
                break;
              case 'id':
              case 'date':
              case 'datetime':
              case 'time':
              case 'number':
                this.filter[field.id].value = new Array(2);
                break;
            }
          }
        );

        this.reload_data(reset);
      }
    });
  }

  update_filter(field: any): void {
    let update_flag = true;
    if (field.type === 'enum' || field.type === 'boolean') {
      const clone_filter = _.cloneDeep(this.filter);
      const value = field.enum.filter(v => (v.hasOwnProperty('checked') && v.checked === true)).map(v => v.value);
      this.filter[field.id].value = value.length > 0 ? value : [null];
      update_flag = JSON.stringify(clone_filter) !== JSON.stringify(this.filter);
    }

    if (update_flag) {
      this.reload_data(true);
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
    const allChecked = this.checkbox_config.data.length > 0
      && this.checkbox_config.data.filter(value => !value.disabled).every(value => value.checked === true);
    const someChecked = this.checkbox_config.data.length > 0
      && this.checkbox_config.data.filter(value => !value.disabled).some(value => value.checked === true);

    this.checkbox_config.all = allChecked;
    this.checkbox_config.indeterminate = !allChecked && someChecked;

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
      this.checkbox_refresh();
    });
  }

  download_pdf() {
    this.loading = true;
    this.load_pdf(() => {
      this.loading = false;
    });
  }

  show_modal_add(): void {
    this.create_modal(data => this.add_data(data), null, null);
  }

  show_modal_edit(): void {
    this.open_edit_modal(this.checkbox_config.ids[0]);
  }

  open_edit_modal(id: number) {
    this.loading_edit_modal = true;
    this.load_data(id).subscribe(
      res => {
        this.loading_edit_modal = false;

        this.create_modal(data => this.edit_data(data), res, null);
      },
      error => {
        this.loading_edit_modal = false;
        // console.error(error);
      });
  }

  show_modal_remove(): void {
    let loading = false;
    this.service$.relatedInfo(this.checkbox_config.ids).subscribe(value => {
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
          nzContent: MessageComponent,
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

        modal.afterOpen.subscribe(() => {
          const component = modal.getContentComponent();
          if (component instanceof MessageComponent) {
            component.title = modal_title;
            component.message = modal_message;
          }
        });
      }
    });
  }

  private create_modal(submit: (data: any) => Observable<any>, result: any, previous_data?: any) {
    let valid = false;
    let loading = false;

    const modal = this.modal$.create({
      nzClosable: false,
      nzMaskClosable: false,
      nzWidth: '45rem',
      nzTitle: null,
      nzContent: this.component,
      nzFooter: this.modalFooter
    });

    this.modal_cancel = () => {
      modal.close();
    };
    this.modal_save = () => {
      loading = true;

      const component = <AbstractForm>modal.getContentComponent();
      component.before_submit();
      const form_data = component.formObject.value;

      component.submitted = true;

      submit(form_data).subscribe(
        res => {
          loading = false;

          this.reload_data();
          component.after_submit();

          modal.close();
        },
        error => {
          loading = false;

          component.handleSubmitError(error);
          component.postSubmit(null);
          // console.error(error);
        });
    };

    this.modal_save_add = () => {
      loading = true;

      const component = <AbstractForm>modal.getContentComponent();
      component.before_submit();
      const form_data = component.formObject.value;

      component.submitted = true;

      submit(form_data).subscribe(
        res => {
          loading = false;

          this.reload_data();
          component.after_submit();

          modal.close();

          this.create_modal(submit, result, form_data);
        },
        error => {
          loading = false;

          component.handleSubmitError(error);
          component.postSubmit(null);
          // console.error(error);
        });
    };

    this.modal_previous = () => {
      const component = modal.getContentComponent();
      if (component instanceof AbstractForm) {
        if (component.tabSelected.value > 0) {
          if (component.tabSelected.value > 0) {
            component.tabSelected.next(component.tabSelected.value - 1);
          }
        }
      }
    };

    this.modal_next = () => {
      const component = modal.getContentComponent();
      if (component instanceof AbstractForm) {
        if (component.tabSelected.value < component.tabCount) {
            component.tabSelected.next(component.tabSelected.value + 1);
        }
      }
    };

    this.modal_previous_show = () => {
      const component = modal.getContentComponent();
      if (component instanceof AbstractForm) {
        return component.tabCount > 0 && component.tabSelected.value > 0;
      }
      return false;
    };

    this.modal_next_show = () => {
      const component = modal.getContentComponent();
      if (component instanceof AbstractForm) {
        // console.log(component.tabCount);
        return component.tabCount > 0 && component.tabSelected.value < (component.tabCount - 1);
      }
      return false;
    };

    this.modal_save_add_show = () => result === null && this.without_save_and_add === false;
    this.modal_save_loading = () => loading;
    this.modal_save_disabled = () => !valid;

    modal.afterOpen.subscribe(() => {
      const component = modal.getContentComponent();
      if (component instanceof AbstractForm) {
        const form = component.formObject;

        if (result !== null) {
          component.edit_mode = true;
          component.loaded.subscribe(v => {
            if (v) {
              component.before_set_form_data(result);
              component.set_form_data(component, form, result);
              component.after_set_form_data();
            }
          });
        } else {
          component.edit_mode = false;

          this.preset_modal_form_data(form); // TODO: review
          component.before_set_form_data(null, previous_data); // TODO: review
        }

        valid = form.valid;
        form.valueChanges.subscribe(val => {
          valid = form.valid;
        });
      }
    });
  }

  protected load_grid_fields() {
    return this.service$.options(this.params);
  }

  protected load_grid(page: number,
                      per_page: number,
                      sort: { key: string, value: string }[],
                      filter: { [id: string]: { condition: number, value: any[] } }) {
    return this.service$.list(page, per_page, sort, filter, this.params);
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

  protected button_action(button) {
    button.click(this.checkbox_config.ids);
  }

  protected routeInfo(route: string, row: any) {
    const multi_pattern: any = route.match(/^([_a-z]+):<(([_a-z0-9\/]+\/:[_a-z]+\|?)+)>$/);

    if (multi_pattern !== null && multi_pattern.length !== 0) {
      if (multi_pattern.length > 3 && row.hasOwnProperty(multi_pattern[1])) {
        const idx = row[multi_pattern[1]] - 1;
        const routes = multi_pattern[2].split('|');

        route = routes[idx];
      } else {
        return null;
      }
    }

    const route_prefix = route.replace(/\/:([_a-z]+)/, '');
    let route_suffix: any = route.match(/\/:([_a-z]+)/);


    if (route_suffix !== null && route_suffix.length === 2) {
      route_suffix = route_suffix[1];
    } else  {
      return null;
    }

    if (!row.hasOwnProperty(route_suffix) || row[route_suffix] === null) {
      return null;
    }

    const route_params = [];
    route_params.push(route_prefix);
    route_params.push(row[route_suffix]);

    if (route_prefix === '/resident') {
      route_params.push({outlets: {'resident-details': ['responsible-persons']}});
    }

    return route_params;
  }

  public check_empty(value: any) {
    if (_.isString(value) || _.isArray(value) || value === null || value === undefined) {
      return !_.isEmpty(value) && !_.isEmpty(_.trim(value)) && value[0] !== null;
    }

    return true;
  }

  protected replace_known_value(value: any) {
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    } else {
      return value;
    }
  }

  protected no_sort_order(a: KeyValue<any, any>, b: KeyValue<any, any>): number {
    return 0;
  }

  protected get_background_color(row: any) {
    const color_row_field = this.fields.filter(v => v.type === 'color_row' && v.hidden === true).pop();

    if (color_row_field) {
      return row[color_row_field.id] === true ? '#d0ffff' : 'inherit';
    }

    return 'inherit';
  }

  protected preset_modal_form_data(form: FormGroup) {
  }

  protected search() {
    this.params = this.params.filter(v => v.key !== 'query');
    this.params.push({key: 'query', value: this.search_query});
    this.reload_data(true);
  }
}
