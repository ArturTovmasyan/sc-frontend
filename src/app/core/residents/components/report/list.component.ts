import {Component, OnDestroy, OnInit} from '@angular/core';
import {ReportService} from '../../services/report.service';
import {TitleService} from '../../../services/title.service';
import {KeyValue} from '@angular/common';
import {AbstractForm} from '../../../../shared/components/abstract-form/abstract-form';
import {ModalButtonOptions, NzModalService} from 'ng-zorro-antd';
import {FormComponent} from './form/form.component';
import {first} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from '../../../../../environments/environment';
import {ResidentSelectorService} from '../../services/resident-selector.service';
import {GroupType} from '../../models/group-type.enum';

@Component({
    templateUrl: './list.component.html'
})
export class ListComponent implements OnInit, OnDestroy {
    protected title: string = null;

    public card: boolean = null;

    public mode: string = '';
    public mode_group: string = null;

    group_type: GroupType;
    active = false;

    public reports = null;
    protected $subscriptions: { [key: string]: Subscription; };

    constructor(private report$: ReportService,
                private title$: TitleService,
                protected modal$: NzModalService,
                private route$: ActivatedRoute,
                private router: Router,
                private residentSelector$: ResidentSelectorService) {
        this.title$.getTitle().subscribe(v => this.title = v);

        this.$subscriptions = {};
    }

    ngOnInit(): void {
        if (this.route$.snapshot.routeConfig.outlet) {
            this.card = true;

            this.mode = 'resident';
            this.subscribe('rs_type');
        } else {
            this.card = true;

            this.mode = 'group';
            switch (this.route$.snapshot.url[0].path) {
                case 'facility':
                    this.mode_group = 'al';
                    this.residentSelector$.type.next(GroupType.FACILITY);
                    break;
                case 'apartment':
                    this.mode_group = 'il';
                    this.residentSelector$.type.next(GroupType.APARTMENT);
                    break;
                case 'region':
                    this.mode_group = 'ihl';
                    this.residentSelector$.type.next(GroupType.REGION);
                    break;
                case 'lead':
                    this.mode_group = 'lead';
                    this.residentSelector$.type.next(GroupType.FACILITY);
                    this.active = true;
                    break;
            }
        }

        this.subscribe('list_report');
    }

    ngOnDestroy(): void {
        Object.keys(this.$subscriptions).forEach(key => this.$subscriptions[key].unsubscribe());
    }

    protected subscribe(key: string, params?: any): void {
        switch (key) {
            case 'list_report':
                this.$subscriptions[key] = this.report$.list().pipe(first()).subscribe(res => {
                    if (res) {
                        this.reports = res;
                    }
                });
                break;
            case 'rs_type':
                this.$subscriptions[key] = this.residentSelector$.type.subscribe(next => {
                    switch (next) {
                        case GroupType.FACILITY:
                            this.mode_group = 'al';
                            break;
                        case GroupType.APARTMENT:
                            this.mode_group = 'il';
                            break;
                        case GroupType.REGION:
                            this.mode_group = 'ihl';
                            break;
                        default:
                            this.mode_group = null;
                            break;
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

    public no_sort_order(a: KeyValue<any, any>, b: KeyValue<any, any>): number {
        return 0;
    }

    show_modal_report(group_alias, report_alias, report_config) {
        this.create_modal(FormComponent, group_alias, report_alias, report_config);
    }

    private create_modal(form_component: any, group_alias: string, report_alias: string, result: any) {
        let valid = false;

        const loading = Array(result.formats.length);

        const footer_config: Array<ModalButtonOptions<any>> = [];

        footer_config.push({
            label: 'Cancel',
            onClick: () => {
                modal.close();
            }
        });

        result.formats.forEach((format, idx) => {
            if (format === 'xls') {
                return;
            }

            loading[idx] = false;
            footer_config.push({
                type: 'primary',
                label: format.toUpperCase(),
                loading: () => loading[idx],
                disabled: () => !valid,
                onClick: () => {
                    loading[idx] = true;

                    const component = <AbstractForm>modal.getContentComponent();
                    component.before_submit();
                    const form_data = component.formValue();

                    component.submitted = true;

                    this.report$.report(group_alias, report_alias, format, form_data, () => {
                        loading[idx] = false;
                        modal.close();
                    }, (error) => {
                        loading[idx] = false;
                        component.handleSubmitError(error);
                        component.postSubmit(null);
                    });
                }
            });
            if (format === 'csv') {
                footer_config.push({
                    type: 'primary',
                    label: format.toUpperCase() + ' View',
                    loading: () => loading[idx],
                    disabled: () => !valid,
                    onClick: () => {
                        loading[idx] = true;

                        const component = <AbstractForm>modal.getContentComponent();
                        component.before_submit();
                        const form_data = component.formValue();
                        component.submitted = true;

                        this.router.navigate(['report-csv'], {
                            queryParams: {
                                g: group_alias,
                                r: report_alias, ...form_data
                            }
                        });
                    }
                });
            }
        });

        const modal = this.modal$.create({
            nzClosable: false,
            nzMaskClosable: false,
            nzWidth: '45rem',
            nzTitle: null,
            nzContent: form_component,
            nzFooter: footer_config
        });

        modal.afterOpen.subscribe(() => {
            const component = modal.getContentComponent();
            if (component instanceof FormComponent) {
                component.init_report_parameters(result.title, result.parameters);

                const form = component.formObject;

                valid = form.valid;
                form.valueChanges.subscribe(val => {
                    valid = form.valid;
                });
            }
        });
    }

    show_group(group: any) {
        let show_in_mode = group.value['show_in_' + this.mode + '_list'];
        let show_in_mode_group = group.value['show_in_' + this.mode_group + '_list'];

        if (show_in_mode === null || show_in_mode === undefined) {
            show_in_mode = true;
        }

        if (show_in_mode_group === null || show_in_mode_group === undefined) {
            show_in_mode_group = true;
        }

        return show_in_mode && show_in_mode_group;
    }
}
