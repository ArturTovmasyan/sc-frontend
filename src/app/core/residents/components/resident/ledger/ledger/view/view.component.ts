import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {TitleService} from '../../../../../../services/title.service';
import {ResidentLedger} from '../../../../../models/resident-ledger';
import {ResidentLedgerService} from '../../../../../services/resident-ledger.service';
import {first} from 'rxjs/operators';
import {NzModalService, simpleEmptyImage} from 'ng-zorro-antd';
import {DomSanitizer} from '@angular/platform-browser';
import {FormComponent as LedgerFormComponent} from '../form/form.component';
import {AbstractForm} from '../../../../../../../shared/components/abstract-form/abstract-form';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {PaymentSource} from '../../../../../models/payment-source';
import {PaymentSourceService} from '../../../../../services/payment-source.service';
import {KeyValue} from '@angular/common';
import {ResidentResponsiblePersonService} from '../../../../../services/resident-responsible-person.service';
import {ResidentResponsiblePerson} from '../../../../../models/resident-responsible-person';
import {PaymentPeriod} from '../../../../../models/payment-period.enum';

@Component({
  templateUrl: './view.component.html'
})
export class ViewComponent implements OnInit, OnDestroy {
  defaultSvg = this.sanitizer.bypassSecurityTrustResourceUrl(simpleEmptyImage);

  ledger: ResidentLedger;

  payment_sources: PaymentSource[];
  residentResponsiblePersons: ResidentResponsiblePerson[];

  rents = [];

  public title: string = null;

  protected $subscriptions: { [key: string]: Subscription; };
  private query_params: Params;

  constructor(
    private sanitizer: DomSanitizer,
    private modal$: NzModalService,
    private title$: TitleService,
    private ledger$: ResidentLedgerService,
    private route$: ActivatedRoute,
    private router$: Router,
    private paymentSource$: PaymentSourceService,
    private residentResponsiblePerson$: ResidentResponsiblePersonService
  ) {
    this.$subscriptions = {};
  }

  ngOnInit(): void {
    this.subscribe('title');
    this.subscribe('query_map');
    this.subscribe('list_payment_source');
    this.subscribe('list_resident_responsible_person');
  }

  ngOnDestroy(): void {
    Object.keys(this.$subscriptions).forEach(key => this.$subscriptions[key].unsubscribe());
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'title':
        this.$subscriptions[key] = this.title$.getTitle().subscribe(v => this.title = v);
        break;
      case 'param_id':
        this.$subscriptions[key] = this.route$.paramMap.subscribe(route_params => {
          if (route_params.has('id')) {
            this.subscribe('get_ledger', {ledger_id: route_params.get('id')});
            this.subscribe('get_rents', {ledger_id: route_params.get('id')});
          }
        });
        break;
      case 'query_map':
        this.$subscriptions[key] = this.route$.queryParams.subscribe(query_params => {
          this.query_params = query_params;
          this.subscribe('param_id');
        });
        break;
      case 'get_ledger':
        this.$subscriptions[key] = this.ledger$.get(params.ledger_id, this.query_params).pipe(first()).subscribe(res => {
          if (res) {
            this.ledger = res;
          }
        });
        break;
      case 'get_rents':
        this.$subscriptions[key] = this.ledger$.getRents(params.ledger_id).pipe(first()).subscribe(res => {
          if (res) {
            this.rents = res;
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
      case 'list_resident_responsible_person':
        this.$subscriptions[key] = this.residentResponsiblePerson$
          .all([{key: 'resident_id', value: this.query_params['resident_id']}]).subscribe(res => {
            if (res) {
              this.residentResponsiblePersons = res;
            }
          });
        break;
      default:
        break;
    }
  }

  protected unsubscribe(key: string): void {
    if (this.$subscriptions.hasOwnProperty(key)) {
      this.$subscriptions[key].unsubscribe();
    }
  }

  show_modal_edit(name: string, isThirdParty?: boolean): void {
    switch (name) {
      case 'ledger':
        this.ledger$.get(this.ledger.id, this.query_params).subscribe(
          res => {
            this.create_modal(LedgerFormComponent, data => this.ledger$.edit(data), res, isThirdParty);
          },
          error => {
          });
        break;
      default:
        break;
    }
  }

  private create_modal(form_component: any, submit: (data: any) => Observable<any>, result: any, isThirdParty?: boolean) {
    let valid = false;
    let loading = false;

    const modal = this.modal$.create({
      nzClosable: false,
      nzMaskClosable: false,
      nzWidth: '45rem',
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
            component.before_submit();
            const form_data = component.formValue();

            component.submitted = true;

            submit(form_data).subscribe(
              res => {
                loading = false;

                this.subscribe('get_ledger', {ledger_id: this.ledger.id});

                modal.close();
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
      if (component instanceof LedgerFormComponent) {
        const form = component.formObject;

        component.isThirdParty = isThirdParty;

        if (result !== null) {
          component.loaded.subscribe(v => {
            if (v) {
              component.edit_mode = true;
              component.before_set_form_data(result);
              component.set_form_data(component, form, result);
              component.after_set_form_data();
            }
          });
        } else {
          component.edit_mode = false;
        }

        valid = form.valid;
        form.valueChanges.subscribe(val => {
          valid = form.valid;
        });
      }
    });
  }

  public no_sort_order(a: KeyValue<any, any>, b: KeyValue<any, any>): number {
    return 0;
  }

  show(direction: string) {
    switch (direction) {
      case 'previous':
          return this.ledger.previous_ledger_id === null;
      case 'next':
          return this.ledger.next_ledger_id === null;
    }

    return null;
  }

  recalculateLedger() {
    if (this.ledger !== null) {
      this.ledger$.recalculate(this.ledger.id).subscribe(res => {
        this.subscribe('get_ledger', {ledger_id: this.ledger.id});
      });
    }
  }

  getPreviousLedger() {
      this.router$.navigate(['resident', 'ledger', this.ledger.previous_ledger_id], {queryParams: this.query_params}).then(() => {
          location.reload();
      });
  }

  getNextLedger() {
      this.router$.navigate(['resident', 'ledger', this.ledger.next_ledger_id], {queryParams: this.query_params}).then(() => {
          location.reload();
      });
  }

  get_source_title(id: number) {
    let result = 'N/A';

    if (this.payment_sources && this.payment_sources.length > 0) {
      const source = this.payment_sources.filter(v => v.id === id).pop();

      if (source) {
        result = source.title;
      }
    }

    return result;
  }

  get_resident_responsible_person_name(id: number) {
    let result = 'N/A';

    if (this.residentResponsiblePersons && this.residentResponsiblePersons.length > 0) {
      const item = this.residentResponsiblePersons.filter(v => v.id === id).pop();

      if (item) {
        result = item.responsible_person.first_name + ' ' + item.responsible_person.last_name;
      }
    }

    return result;
  }

  get_source_period(id: number) {
    let result: PaymentPeriod;

    if (this.payment_sources && this.payment_sources.length > 0) {
      const source = this.payment_sources.filter(v => v.id === id).pop();

      if (source) {
        result = source.period;
      }
    }

    return result;
  }

  get_prior_date() {
    let result = new Date();

    if (this.ledger.date_created) {
      result = new Date(this.ledger.date_created);
      result.setDate(1);
      result.setMonth(result.getMonth() - 1);
    }

    return result;
  }
}
