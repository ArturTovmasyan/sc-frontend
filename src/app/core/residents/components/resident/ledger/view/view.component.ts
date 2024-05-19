import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {TitleService} from '../../../../../services/title.service';
import {ResidentLedger} from '../../../../models/resident-ledger';
import {ResidentLedgerService} from '../../../../services/resident-ledger.service';
import {first} from 'rxjs/operators';
import {NzModalService, simpleEmptyImage} from 'ng-zorro-antd';
import {DomSanitizer} from '@angular/platform-browser';
import {FormComponent as LedgerFormComponent} from '../form/form.component';
import {AbstractForm} from '../../../../../../shared/components/abstract-form/abstract-form';
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  templateUrl: './view.component.html'
})
export class ViewComponent implements OnInit, OnDestroy {
  defaultSvg = this.sanitizer.bypassSecurityTrustResourceUrl(simpleEmptyImage);

  ledger: ResidentLedger;

  public title: string = null;

  protected $subscriptions: { [key: string]: Subscription; };
  private query_params: Params;

  constructor(
    private sanitizer: DomSanitizer,
    private modal$: NzModalService,
    private title$: TitleService,
    private ledger$: ResidentLedgerService,
    private route$: ActivatedRoute,
    private router$: Router
  ) {
    this.$subscriptions = {};
  }

  ngOnInit(): void {
    this.subscribe('title');
    this.subscribe('query_map');
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
      case 'ledger':
        this.ledger$.get(this.ledger.id, this.query_params).subscribe(
          res => {
            this.create_modal(LedgerFormComponent, data => this.ledger$.edit(data), res);
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
      if (component instanceof AbstractForm) {
        const form = component.formObject;

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

  show(direction: string) {
    switch (direction) {
      case 'previous':
          return this.ledger.previous_ledger_id === null;
      case 'next':
          return this.ledger.next_ledger_id === null;
    }

    return null;
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
}
