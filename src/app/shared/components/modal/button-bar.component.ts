import * as _ from 'lodash';
import {Component, Input, OnInit, Type} from '@angular/core';
import {Observable} from 'rxjs';
import {FormGroup} from '@angular/forms';
import {ModalFormService} from '../../services/modal-form.service';
import {GridService} from '../../services/grid.service';
import {AuthGuard} from '../../../core/guards/auth.guard';

export enum ButtonMode {
  FREE_SELECT,
  NO_SELECT,
  SINGLE_SELECT,
  MULTI_SELECT
}

export class Button {
  name: string;
  title: string;
  type: string;

  mode: ButtonMode;

  nzIcon: string;
  faIcon: string;

  override: boolean;
  show: boolean;

  click: (params?: any[]) => void;


  constructor(
    name: string,
    title: string,
    type: string,
    mode: ButtonMode,
    nzIcon: string,
    faIcon: string,
    override: boolean,
    show: boolean,
    click: (params?: any[]) => void
  ) {
    this.name = name;
    this.title = title;
    this.type = type;
    this.mode = mode;
    this.nzIcon = nzIcon;
    this.faIcon = faIcon;
    this.override = override;
    this.show = show;
    this.click = click;
  }
}

@Component({
  selector: 'app-button-bar',
  styles: [':host { margin-bottom: 1rem;display: block; }'],
  templateUrl: './button-bar.component.html'
})
export class ButtonBarComponent implements OnInit {
  @Input() permission: string;

  @Input() single_select: boolean;
  @Input() multi_select: boolean;
  private _ids: number[];

  @Input() component: Type<any>;

  private _service$: GridService<any>;
  private _preset_modal_form_data: (form: FormGroup) => void;
  private _modal_callback: (data: any) => void;
  private _remove_modal_callback: (data: any) => void = null;
  private _exclude: string[] = [];

  @Input() set ids(value: number[]) {
    this._ids = value;
  }

  @Input() set preset_modal_form_data(value: (form: FormGroup) => void) {
    this._preset_modal_form_data = value;
  }

  @Input() set modal_callback(value: (data: any) => void) {
    this._modal_callback = value;
  }

  @Input() set remove_modal_callback(value: (data: any) => void) {
    this._remove_modal_callback = value;
  }

  @Input() set service(value: GridService<any>) {
    this._service$ = value;
  }

  @Input() set exclude(values: string[]) {
    this._exclude = values;
  }

  buttons_crud: Button[] = [];
  buttons_left: Button[] = [];
  buttons_center: Button[] = [];
  buttons_right: Button[] = [];

  constructor(
    protected modal$: ModalFormService,
    private auth_$: AuthGuard
  ) {

  }

  ngOnInit() {
    if (this.addIfHasPermission(this.permission, 3) && this._exclude.filter(v => v === 'add').length === 0) {
      this.buttons_crud.push(new Button(
        'add',
        'grid.add',
        'primary',
        ButtonMode.FREE_SELECT,
        'plus',
        null,
        true,
        true,
        () => this.show_modal_add()
      ));
    }

    if (this.addIfHasPermission(this.permission, 2) && this._exclude.filter(v => v === 'edit').length === 0) {
      this.buttons_crud.push(new Button(
        'edit',
        'grid.edit',
        'default',
        ButtonMode.SINGLE_SELECT,
        'edit',
        null,
        true,
        true,
        () => this.show_modal_edit()
      ));
    }

    if (this.addIfHasPermission(this.permission, 4) && this._exclude.filter(v => v === 'remove').length === 0) {
      this.buttons_crud.push(new Button(
        'remove',
        'grid.remove',
        'danger',
        ButtonMode.MULTI_SELECT,
        'delete',
        null,
        true,
        true,
        () => this.show_modal_remove()
      ));
    }
  }

  check_for_disable(button: Button): boolean {
    switch (button.mode) {
      case ButtonMode.FREE_SELECT:
        return false;
      case ButtonMode.NO_SELECT:
        return this.single_select || this.multi_select;
      case ButtonMode.SINGLE_SELECT:
        return (!this.single_select || this.multi_select) || this._ids.length === 0;
      case ButtonMode.MULTI_SELECT:
        return (!this.single_select && !this.multi_select) || this._ids.length === 0;
    }
  }

  show_modal_add(): void {
    this.create_modal(false, {submit: data => this._service$.add(data), result: null, previous_data: null});
  }

  show_modal_edit(): void {
    this.open_edit_modal(this._ids[0]);
  }

  open_edit_modal(id: number) {
    this._service$.get(id).subscribe(
      res => {
        this.create_modal(false, {submit: data => this._service$.edit(data), result: res, previous_data: null});
      },
      error => {
        console.error(error);
      });
  }

  show_modal_remove(): void {
    this._service$.relatedInfo(this._ids).subscribe(value => {
      if (value) {
        let relation_count = 0;
        if (_.isArray(value) && value.length > 0) {
          relation_count = Object.keys(value[0])
            .reduce((previousValue, currentValue) => (previousValue + value[0][currentValue].sum), 0);
        }

        this.create_modal(true, null, {submit: data => this._service$.removeBulk(data), relation_count: relation_count, ids: this._ids});
      }
    });
  }

  private create_modal(remove_mode: boolean,
                       add_edit?: { submit: (data: any) => Observable<any>, result: any, previous_data?: any },
                       remove?: { submit: (ids: number[]) => Observable<any>, relation_count: number, ids: number[] }) {
    const modal = this.modal$.create(this.component);
    modal.modal_callback = (data) => this._modal_callback(data);

    if (this._remove_modal_callback !== null) {
      modal.remove_modal_callback = (data) => this._remove_modal_callback(data);
    } else {
      modal.remove_modal_callback = null;
    }

    if (this._preset_modal_form_data) {
      modal.preset_modal_form_data = (form: FormGroup) => this._preset_modal_form_data(form);
    }

    if (remove_mode) {
      modal.create_remove_confirm(remove.submit, remove.relation_count, remove.ids);
    } else {
      modal.create(data => add_edit.submit(data), add_edit.result, add_edit.previous_data);
    }
  }

  public override_crud_buttons(button_data: any): void {
    const add_button = this.buttons_crud.filter(v => v.name === 'add').pop();
    const edit_button = this.buttons_crud.filter(v => v.name === 'edit').pop();
    const remove_button = this.buttons_crud.filter(v => v.name === 'remove').pop();

    if (add_button && add_button.override) {
      add_button.show = (add_button.show === false || button_data.add === false) ? false : button_data.add;
    }

    if (edit_button && edit_button.override) {
      edit_button.show = (edit_button.show === false || button_data.edit === false) ? false : button_data.edit;
    }

    if (remove_button && remove_button.override) {
      remove_button.show = (remove_button.show === false || button_data.remove === false) ? false : button_data.remove;
    }
  }

  public add_button_crud(button: Button) {
    this.add_button(this.buttons_crud, button);
  }

  public add_button_left(button: Button) {
    this.add_button(this.buttons_left, button);
  }

  public add_button_center(button: Button) {
    this.add_button(this.buttons_center, button);
  }

  public add_button_right(button: Button) {
    this.add_button(this.buttons_right, button);
  }

  public clear_button_left() {
    this.buttons_left = [];
  }

  public clear_button_center() {
    this.buttons_center = [];
  }

  public clear_button_right() {
    this.buttons_right = [];
  }

  private add_button(button_group: Button[], button: Button) {
    const idx = button_group.findIndex(v => v.name === button.name);

    if (idx !== -1) {
      button_group.splice(idx, 1, button);
    } else {
      button_group.push(button);
    }
  }

  public get_button(name: string): Button {
    const buttons: Button[] = [...this.buttons_left, ...this.buttons_center, ...this.buttons_right];
    const button = buttons.filter(value => value.name === name).pop();

    return button;
  }

  addIfHasPermission(permission: string, level: number) {
    return this.auth_$.checkPermission([permission], level);
  }

}
