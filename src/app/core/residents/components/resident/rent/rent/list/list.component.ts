import * as _ from 'lodash';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {NzModalService, simpleEmptyImage} from 'ng-zorro-antd';
import {ResidentRentService} from '../../../../../services/resident-rent.service';
import {ResidentRent} from '../../../../../models/resident-rent';
import {first} from 'rxjs/operators';
import {Observable, Subscription} from 'rxjs';
import {DomSanitizer} from '@angular/platform-browser';
import {ResidentSelectorService} from '../../../../../services/resident-selector.service';
import {AbstractForm} from '../../../../../../../shared/components/abstract-form/abstract-form';
import {FormComponent as ResidentRentFormComponent} from '../form/form.component';
import {TitleService} from '../../../../../../services/title.service';
import {PaymentSource} from '../../../../../models/payment-source';
import {PaymentSourceService} from '../../../../../services/payment-source.service';

@Component({
  selector: 'app-resident-rent-room',
  templateUrl: './list.component.html'
})
export class ListComponent implements OnDestroy, OnInit {
  _ResidentRentFormComponent = ResidentRentFormComponent;

  defaultSvg = this.sanitizer.bypassSecurityTrustResourceUrl(simpleEmptyImage);

  resident_rents: ResidentRent[];
  payment_sources: PaymentSource[];

  private $subscriptions: { [key: string]: Subscription; };

  checkbox_config = {
    all: false,
    indeterminate: false,
    data: [],
    ids: []
  };

  public modal_callback: () => void = () => this.reload_data();

  constructor(
    private sanitizer: DomSanitizer,
    private modal$: NzModalService,
    private residentSelector$: ResidentSelectorService,
    public service$: ResidentRentService,
    private paymentSource$: PaymentSourceService
  ) {
    this.$subscriptions = {};

    this.resident_rents = [];
  }

  ngOnInit(): void {
    this.subscribe('list_payment_source');
    this.subscribe('rs_resident');
  }

  ngOnDestroy(): void {
    Object.keys(this.$subscriptions).forEach(key => this.$subscriptions[key].unsubscribe());
  }

  unsubscribe(key: string): void {
    if (this.$subscriptions.hasOwnProperty(key)) {
      this.$subscriptions[key].unsubscribe();
    }
  }

  subscribe(key: string, params?: any) {
    switch (key) {
      case 'rs_resident':
        this.$subscriptions[key] = this.residentSelector$.resident.subscribe(next => {
          if (next) {
            this.reload_data();
          }
        });
        break;
      case 'list_payment_source':
        this.$subscriptions[key] = this.paymentSource$.all().pipe(first()).subscribe(res => {
          if (res) {
            this.payment_sources = res;
          }
        });
        break;
      case 'list_resident_rent':
        this.$subscriptions[key] = this.service$.all([{
          key: 'resident_id',
          value: this.residentSelector$.resident.value.toString()
        }]).pipe(first()).subscribe(res => {
          if (res) {
            this.resident_rents = res;
          }
        });
        break;
      default:
        break;
    }
  }

  get_source_title(id: number) {
    let result = '(none)';

    if (this.payment_sources && this.payment_sources.length > 0) {
      const source = this.payment_sources.filter(v => v.id === id).pop();

      if (source) {
        result = source.title;
      }
    }

    return result;
  }

  reload_data() {
    this.subscribe('list_resident_rent');
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

  current_page_data_change($event: Array<any>): void {
    this.checkbox_config.data = $event;
    this.checkbox_refresh();
  }
}
