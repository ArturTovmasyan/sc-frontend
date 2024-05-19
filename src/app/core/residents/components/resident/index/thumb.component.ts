import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {simpleEmptyImage} from 'ng-zorro-antd';
import {DomSanitizer} from '@angular/platform-browser';
import {first} from 'rxjs/operators';
import {AuthGuard} from '../../../../guards/auth.guard';
import {Subscription} from 'rxjs';
import {Resident} from '../../../models/resident';
import {GroupType} from '../../../models/group-type.enum';
import {ResidentAdmissionService} from '../../../services/resident-admission.service';

@Component({
  selector: 'app-residents-thumbs',
  templateUrl: './thumb.component.html',
  providers: []
})
export class ThumbComponent implements OnInit, OnDestroy {
  @Input('options') set options(options: {state?: string, type?: number, type_id?: number, sort_resident?: boolean, sort_room?: boolean}) {
    this.route_options.page = 1;
    this.route_options.state = options.state;
    this.route_options.type = options.type;
    this.route_options.type_id = options.type_id;
    this.route_options.sort_resident = options.sort_resident;
    this.route_options.sort_room = options.sort_room;
    this.reload_residents();
  }

  GROUP_TYPE = GroupType;
  defaultSvg = this.sanitizer.bypassSecurityTrustResourceUrl(simpleEmptyImage);

  residents: Resident[];

  route_options: {
    page: number,
    per_page: number,
    total: number,
    state?: string,
    type?: number,
    type_id?: number,
    sort_resident?: boolean,
    sort_room?: boolean
  } = {
    page: 1,
    per_page: 30,
    total: null,
    state: null,
    type: null,
    type_id: null,
    sort_resident: null,
    sort_room: null
  };

  protected $subscriptions: { [key: string]: Subscription; };

  constructor(
    private sanitizer: DomSanitizer,
    private service$: ResidentAdmissionService,
    private auth_$: AuthGuard
  ) {
    this.$subscriptions = {};
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    Object.keys(this.$subscriptions).forEach(key => this.$subscriptions[key].unsubscribe());
  }

  protected unsubscribe(key: string): void {
    if (this.$subscriptions.hasOwnProperty(key)) {
      this.$subscriptions[key].unsubscribe();
    }
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'list_resident':
        this.$subscriptions[key] = this.service$.list_by_page(params).pipe(first()).subscribe(res => {
          if (res) {
            this.route_options.total = res.total;
            this.residents = res.data;
          }
        });
        break;
      default:
        break;
    }
  }

  addIfHasPermission(permission: string) {
    return this.auth_$.checkPermission([permission]);
  }

  reload_residents() {
    this.subscribe('list_resident', [
      {key: 'page', value: this.route_options.page},
      {key: 'per_page', value: this.route_options.per_page},
      {key: 'state', value: this.route_options.state},
      {key: 'type', value: this.route_options.type},
      {key: 'type_id', value: this.route_options.type_id},
      {key: 'resident', value: this.route_options.sort_resident !== null ? (this.route_options.sort_resident ? 'ASC' : 'DESC') : null},
      {key: 'room', value: this.route_options.sort_room !== null ? (this.route_options.sort_room ? 'ASC' : 'DESC') : null}
    ]);
  }

  page_changed($event: number) {
    this.route_options.page = $event;
    this.reload_residents();
  }

  page_size_changed($event: number) {
    this.route_options.page = 1;
    this.route_options.per_page = $event;
    this.reload_residents();
  }
}
