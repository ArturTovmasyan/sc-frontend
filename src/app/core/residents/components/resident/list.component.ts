import {Component, OnDestroy, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../services/title.service';
import {ResidentService} from '../../services/resident.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
import {FormComponent} from './resident/form/form.component';
import {Resident} from '../../models/resident';
import {RouterParams} from '../../../services/router-params';
import {ActivatedRoute} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {FacilityService} from '../../services/facility.service';
import {ApartmentService} from '../../services/apartment.service';
import {RegionService} from '../../services/region.service';
import {GroupType} from '../../models/group-type.enum';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [ResidentService]
})
export class ListComponent extends GridComponent<Resident, ResidentService> implements OnInit, OnDestroy {
  $init: BehaviorSubject<boolean>;

  constructor(
    protected service$: ResidentService,
    protected title$: TitleService,
    protected modal$: NzModalService,
    protected route$: ActivatedRoute,
    protected facility$: FacilityService,
    protected apartment$: ApartmentService,
    protected region$: RegionService,
    protected route_params: RouterParams
  ) {
    super(service$, title$, modal$);

    this.$init = new BehaviorSubject<boolean>(false);

    this.component = FormComponent;

    this.name = 'resident-list';
  }

  ngOnInit(): void {
    this.subscribe('segment');
    this.subscribe('init');
  }

  protected subscribe(key: string, params?: any) {
    switch (key) {
      case 'init':
        this.$subscriptions[key] = this.$init.subscribe(value => {
          if (value) {
            super.init();
          }
        });
        break;
      case 'segment':
        this.$subscriptions[key] = this.route$.url.subscribe(value => {
          if (value && value.length > 0) {
            if (value.length === 1) {
              this.params.push({key: 'state', value: value[0].path});
            } else if (value.length === 2) {
              this.params.push({key: 'type', value: value[0].path});
              this.params.push({key: 'type_id', value: value[1].path});
            }

            switch (parseInt(value[0].path, 10)) {
              case GroupType.FACILITY:
                this.subscribe('get_facility', {facility_id: value[1].path});
                break;
              case GroupType.APARTMENT:
                this.subscribe('get_apartment', {apartment_id: value[1].path});
                break;
              case GroupType.REGION:
                this.subscribe('get_region', {region_id: value[1].path});
                break;
            }

            this.$init.next(true);
          } else {
            this.$init.next(true);
          }
        });
        break;
      case 'get_facility':
        this.$subscriptions[key] = this.facility$.get(params.facility_id).subscribe(value => {
          if (value) {
            this.title$.setTitle(value.name);
          }
        });
        break;
      case 'get_apartment':
        this.$subscriptions[key] = this.apartment$.get(params.apartment_id).subscribe(value => {
          if (value) {
            this.title$.setTitle(value.name);
          }
        });
        break;
      case 'get_region':
        this.$subscriptions[key] = this.region$.get(params.region_id).subscribe(value => {
          if (value) {
            this.title$.setTitle(value.name);
          }
        });
        break;
    }
  }
}
