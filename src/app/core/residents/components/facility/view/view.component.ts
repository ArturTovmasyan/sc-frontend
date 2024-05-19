import {ActivatedRoute} from '@angular/router';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {TitleService} from '../../../../services/title.service';
import {first} from 'rxjs/operators';
import {NzModalService, simpleEmptyImage} from 'ng-zorro-antd';
import {DomSanitizer} from '@angular/platform-browser';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {FormComponent as FacilityFormComponent} from '../form/form.component';
import {AuthGuard} from '../../../../guards/auth.guard';
import {FacilityService} from '../../../services/facility.service';
import {Facility} from '../../../models/facility';

@Component({
  templateUrl: './view.component.html'
})
export class ViewComponent implements OnInit, OnDestroy {
  defaultSvg = this.sanitizer.bypassSecurityTrustResourceUrl(simpleEmptyImage);

  facility: Facility;

  public title: string = null;

  protected $subscriptions: { [key: string]: Subscription; };

  constructor(
    private sanitizer: DomSanitizer,
    private modal$: NzModalService,
    private title$: TitleService,
    private facility$: FacilityService,
    private route$: ActivatedRoute,
    private auth_$: AuthGuard
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
            this.subscribe('get_facility', {facility_id: route_params.get('id')});
          }
        });
        break;
      case 'get_facility':
        this.$subscriptions[key] = this.facility$.get(params.facility_id).pipe(first()).subscribe(res => {
          if (res) {
            this.facility = res;
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

  public checkPermission(expected_permissions: string[]): boolean {
    return this.auth_$.checkPermission(expected_permissions);
  }

  show_modal_edit(name: string): void {
    switch (name) {
      case 'facility':
        this.facility$.get(this.facility.id).subscribe(
          res => {
            this.create_modal(FacilityFormComponent, data => this.facility$.edit(data), res);
          },
          error => {
          });
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

                this.subscribe('get_facility', {facility_id: this.facility.id});

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
}
