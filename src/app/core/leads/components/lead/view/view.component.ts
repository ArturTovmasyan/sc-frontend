import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {TitleService} from '../../../../services/title.service';
import {Lead} from '../../../models/lead';
import {LeadService} from '../../../services/lead.service';
import {first} from 'rxjs/operators';
import {NzModalService, simpleEmptyImage} from 'ng-zorro-antd';
import {DomSanitizer} from '@angular/platform-browser';
import {Referral} from '../../../models/referral';
import {ReferralService} from '../../../services/referral.service';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {FormComponent as LeadFormComponent} from '../form/form.component';
import {FormComponent as ReferralFormComponent} from '../../referral/form/form.component';
import {ActivatedRoute} from '@angular/router';

@Component({
  templateUrl: './view.component.html'
})
export class ViewComponent implements OnInit, OnDestroy {
  defaultSvg = this.sanitizer.bypassSecurityTrustResourceUrl(simpleEmptyImage);

  lead: Lead;
  referral: Referral;

  public title: string = null;

  protected $subscriptions: { [key: string]: Subscription; };

  constructor(
    private sanitizer: DomSanitizer,
    private modal$: NzModalService,
    private title$: TitleService,
    private lead$: LeadService,
    private referral$: ReferralService,
    private route$: ActivatedRoute
  ) {
    this.$subscriptions = {};
  }

  ngOnInit(): void {
    this.subscribe('title');
    this.subscribe('param_id');
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
            this.subscribe('get_lead', {lead_id: route_params.get('id')});
          }
        });
        break;
      case 'get_lead':
        this.$subscriptions[key] = this.lead$.get(params.lead_id).pipe(first()).subscribe(res => {
          if (res) {
            this.lead = res;

            this.subscribe('get_referral', {referral_id: res.referral.id});
          }
        });
        break;
      case 'get_referral':
        this.$subscriptions[key] = this.referral$.get(params.referral_id).pipe(first()).subscribe(res => {
          if (res) {
            this.referral = res;
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

  show_modal_edit(name: string): void {
    switch (name) {
      case 'lead':
        this.lead$.get(this.lead.id).subscribe(
          res => {
            this.create_modal(LeadFormComponent, data => this.lead$.edit(data), res);
          },
          error => {
          });
        break;
      case 'referral':
        this.referral$.get(this.referral.id).subscribe(
          res => {
            this.create_modal(ReferralFormComponent, data => this.referral$.edit(data), res);
          },
          error => {
          });
        break;
      default:
        break;
    }
  }

  private create_modal(form_component: any, submit: (data: any) => Observable<any>, result: any) {
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
            const form_data = component.formObject.value;

            component.submitted = true;

            submit(form_data).subscribe(
              res => {
                loading = false;

                this.subscribe('get_lead', {lead_id: this.lead.id});

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
      if (component instanceof AbstractForm) {
        const form = component.formObject;

        if (component instanceof ReferralFormComponent) {
          component.show_lead = false;
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
}
