import * as _ from 'lodash';
import {OnDestroy, ViewChild} from '@angular/core';
import {KeyValue} from '@angular/common';
import {BehaviorSubject, Subscription} from 'rxjs';
import {TitleService} from '../../../core/services/title.service';
import {GridService} from '../../services/grid.service';
import {ModalFormService} from '../../services/modal-form.service';
import {Button, ButtonBarComponent} from '../modal/button-bar.component';

export class GridComponent<T extends IdInterface, Service extends GridService<T>> implements OnDestroy {
  _ = _;

  protected _btnBar: ButtonBarComponent;

  @ViewChild(ButtonBarComponent, {static: false}) set btnBar(btnBar: ButtonBarComponent) {
    this._btnBar = btnBar;
  }

  public modal_callback: () => void = () => this.reload_data();

  protected grid_options_loaded: BehaviorSubject<boolean>;

  public card: boolean = true; // TODO(haykg): review to convert Input
  public searchable: boolean = true; // TODO(haykg): review to convert Input

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

  protected header: any[] = null;
  protected header_helper: any[];
  protected fields: any[] = null;
  protected data = [];

  protected title: string = null;
  protected name: string = null;

  protected search_query: string = '';

  protected component: any;

  private filter: { [id: string]: { condition: number, value: any[] } } = {};
  private sort: { key: string, value: string }[] = [];

  protected params: { key: string, value: string }[] = [];

  protected $subscriptions: { [key: string]: Subscription; };

  constructor(protected service$: Service, protected title$: TitleService, protected modal$: ModalFormService) {
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
        this._btnBar.override_crud_buttons(data.buttons);

        this.grid_options_loaded.next(true);

        this.fields = data.fields;
        this.header = [{}];

        const col_groups = {};

        this.fields
          .filter(f => f.hasOwnProperty('col_group'))
          .map(f => f.col_group)
          .forEach((col_group) => col_groups[col_group] = (col_groups[col_group] || 0) + 1);

        const has_col_group = Object.keys(col_groups).length > 0;

        if (has_col_group) {
          this.header.push({});
        }

        this.fields.forEach(
          field => {
            if (field.col_group) {
              this.header[0][field.col_group] = {
                colspan: col_groups[field.col_group],
                rowspan: 1,
                row_span_max: has_col_group ? 2 : 1,
                field: {id: field.col_group}
              };
              this.header[1][field.id] = {
                colspan: null,
                rowspan: 1,
                row_span_max: has_col_group ? 2 : 1,
                field: field
              };
            } else {
              this.header[0][field.id] = {
                colspan: null,
                rowspan: 2,
                row_span_max: has_col_group ? 2 : 1,
                field: field
              };
            }

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

        this.header = this.header.map(header_row => Object.values(header_row));
        this.header_helper = new Array(this.header[0].filter(v => v.field.hasOwnProperty('hidden') && v.field.hidden === false).length);

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

    this.on_reload();
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
    } else {
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

  protected sort_order_func(sorted: boolean): (a: KeyValue<string, any>, b: KeyValue<string, any>) => number {
    // Preserve original property order
    const originalOrder = (a: KeyValue<string, any>, b: KeyValue<string, any>): number => {
      return 0;
    };

    // Order by descending property key
    const keyAscOrder = (a: KeyValue<string, any>, b: KeyValue<string, any>): number => {
      return a.key.localeCompare(b.key);
    };

    return sorted ? keyAscOrder : originalOrder;
  }

  protected get_background_color(row: any) {
    const color_row_field = this.fields.filter(v => v.type === 'color_row' && v.hidden === true).pop();

    if (color_row_field) {
      return row[color_row_field.id] === true ? '#d0ffff' : 'inherit';
    }

    return 'inherit';
  }

  protected search() {
    this.add_param('query', this.search_query);
    this.reload_data(true);
  }

  protected add_param(key: string, value: string) {
    this.params = this.params.filter(v => v.key !== key);
    this.params.push({key: key, value: value});
  }

  protected remove_param(key: string) {
    this.params = this.params.filter(v => v.key !== key);
  }

  open_edit_modal(id: number) {
    const btn = this._btnBar.buttons_crud.filter(v => v.name === 'edit').pop();
    if (btn.show) {
      this._btnBar.open_edit_modal(id);
    }
  }

  public add_button_left(button: Button) {
    this._btnBar.buttons_left.push(button);
  }

  public add_button_center(button: Button) {
    this._btnBar.buttons_center.push(button);
  }

  public add_button_right(button: Button) {
    this._btnBar.buttons_right.push(button);
  }

  public clear_button_left() {
    this._btnBar.buttons_left = [];
  }

  public clear_button_center() {
    this._btnBar.buttons_center = [];
  }

  public clear_button_right() {
    this._btnBar.buttons_right = [];
  }

  public on_reload() {

  }

  public showCheckboxes(): boolean {
    return this.component || this._btnBar.buttons_left.length > 0 || this._btnBar.buttons_center.length > 0 || this._btnBar.buttons_right.length > 0;
  }

  button_action(action: string, id: any) {
    const button_name = action.replace(':', '');
    const button: Button = this._btnBar.get_button(button_name);

    if (button !== null) {
      button.click([id]);
    }
  }

}
