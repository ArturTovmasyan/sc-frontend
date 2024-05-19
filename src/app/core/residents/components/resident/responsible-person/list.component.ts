import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {Observable, Subscription} from 'rxjs';
import {first} from 'rxjs/operators';
import {simpleEmptyImage} from 'ng-zorro-antd';
import {AuthGuard} from '../../../../guards/auth.guard';
import {Button, ButtonBarComponent, ButtonMode} from '../../../../../shared/components/modal/button-bar.component';
import {ModalFormService} from '../../../../../shared/services/modal-form.service';
import {TitleService} from '../../../../services/title.service';
import {FormComponent} from './form/form.component';
import {FormComponent as ReorderFormComponent} from './reorder/form.component';
import {FormComponent as ResponsiblePersonFormComponent} from '../../responsible-person/form/form.component';
import {ResidentSelectorService} from '../../../services/resident-selector.service';
import {ResponsiblePersonService} from '../../../services/responsible-person.service';
import {ResidentResponsiblePersonService} from '../../../services/resident-responsible-person.service';
import {ResidentResponsiblePerson} from '../../../models/resident-responsible-person';

@Component({
  templateUrl: './list.component.html',
  providers: [ResidentResponsiblePersonService]
})
export class ListComponent implements OnInit, OnDestroy, AfterViewInit {
  _FormComponent = FormComponent;

  defaultSvg = this.sanitizer.bypassSecurityTrustResourceUrl(simpleEmptyImage);

  protected _btnBar: ButtonBarComponent;

  @ViewChild(ButtonBarComponent, {static: false}) set btnBar(btnBar: ButtonBarComponent) {
    this._btnBar = btnBar;
  }

  public title: string = null;

  selected_tab: number;
  responsible_persons: ResidentResponsiblePerson[];

  private $subscriptions: { [key: string]: Subscription; };

  public modal_callback: (data: any) => void = (data: any) => this.reload_data(data);

  constructor(
    public service$: ResidentResponsiblePersonService,
    private title$: TitleService,
    private modal$: ModalFormService,
    private residentSelector$: ResidentSelectorService,
    private responsiblePerson$: ResponsiblePersonService,
    private sanitizer: DomSanitizer,
    private auth_$: AuthGuard
  ) {
    this.selected_tab = null;
    this.$subscriptions = {};
  }

  ngOnInit(): void {
    this.subscribe('title');
    this.subscribe('resident_id');
  }

  ngOnDestroy(): void {
    Object.keys(this.$subscriptions).forEach(key => this.$subscriptions[key].unsubscribe());
  }

  ngAfterViewInit(): void {
    const edit_btn = this._btnBar.buttons_crud.filter(v => v.name === 'edit').pop();

    if (edit_btn) {
      edit_btn.title = 'Change Responsible Person';
    }
  }

  unsubscribe(key: string): void {
    if (this.$subscriptions.hasOwnProperty(key)) {
      this.$subscriptions[key].unsubscribe();
    }
  }

  subscribe(key: string, params?: any) {
    this.unsubscribe(key);
    switch (key) {
      case 'title':
        this.$subscriptions[key] = this.title$.getTitle().subscribe(v => this.title = v);
        break;
      case 'resident_id':
        this.$subscriptions[key] = this.residentSelector$.resident.subscribe(next => {
          if (next) {
            this.reload_data();
          }
        });
        break;
      case 'list_resident_responsible_person':
        this.$subscriptions[key] = this.service$
          .all([{key: 'resident_id', value: `${this.residentSelector$.resident.value}`}])
          .pipe(first()).subscribe(next => {
            if (next) {
              this.responsible_persons = next;

              if (params) {
                if (params.hasOwnProperty('id')) {
                  this.selected_tab = this.responsible_persons
                    .findIndex(v => v === this.responsible_persons.find(value => value.id === params.id));
                } else if (params.hasOwnProperty('selected_tab')) {
                  this.selected_tab = params.selected_tab;
                } else {
                  this.selected_tab = 0;
                }
              } else {
                this.selected_tab = 0;
              }

              this._btnBar.add_button_crud(new Button(
                'reorder',
                'grid.reorder',
                'default',
                ButtonMode.FREE_SELECT,
                'drag',
                null,
                true,
                true,
                () => this.subscribe('md_reorder')
              ));
            }
          });
        break;
      case 'md_rp_edit':
        this.$subscriptions[key] = this.responsiblePerson$.get(params.id).subscribe(
          res => {
            if (res) {
              this.create_modal(ResponsiblePersonFormComponent, data => this.responsiblePerson$.edit(data), res);
            }
          });
        break;
      case 'md_reorder':
        this.$subscriptions[key] = this.service$.all([{key: 'resident_id', value: `${this.residentSelector$.resident.value}`}])
          .pipe(first()).subscribe(next => {
            if (next) {
              this.create_modal(ReorderFormComponent, data => this.service$.reorder(data), {responsible_persons: next});
            }
          });
        break;
      default:
        break;
    }
  }

  reload_data(id?: number[]) {
    if (id && id.length > 0) {
      this.subscribe('list_resident_responsible_person', {id: id[0]});
    } else {
      if (this.selected_tab !== null) {
        this.subscribe('list_resident_responsible_person', {selected_tab: this.selected_tab});
      } else {
        this.subscribe('list_resident_responsible_person');
      }
    }
  }

  private create_modal(component: any, submit: (data: any) => Observable<any>, result: any) {
    const modal = this.modal$.create(component);
    modal.modal_callback = this.modal_callback;

    modal.create(data => submit(data), result);
  }

  addIfHasPermission(permission: string, level: number) {
    return this.auth_$.checkPermission([permission], level);
  }

  get_selected_ids() {
    if (this.selected_tab !== null) {
      if (this.responsible_persons) {
        if (this.responsible_persons.length > this.selected_tab) {
          return [this.responsible_persons[this.selected_tab].id];
        }
      }
    }

    return [];
  }
}
