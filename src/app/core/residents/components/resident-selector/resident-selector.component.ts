import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ResidentSelectorService} from '../../services/resident-selector.service';
import {FormBuilder} from '@angular/forms';
import {AuthGuard} from '../../../guards/auth.guard';
import {ResidentService} from '../../services/resident.service';
import {Resident} from '../../models/resident';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-resident-selector',
  templateUrl: './resident-selector.component.html',
  styleUrls: ['./resident-selector.component.scss']
})
export class ResidentSelectorComponent implements OnInit, OnDestroy {
  residents: Resident[];

  resident_id: number;

  private $subscriptions: { [key: string]: Subscription; };

  constructor(
    private formBuilder: FormBuilder,
    private router$: Router,
    private auth_$: AuthGuard,
    private resident$: ResidentService,
    public residentSelector$: ResidentSelectorService
  ) {
    this.$subscriptions = {};
  }

  ngOnInit(): void {
    this.subscribe('rs_resident');
    this.subscribe('list_resident');
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
      case 'list_resident':
        this.$subscriptions[key] = this.resident$.all().subscribe(res => {
          if (res) {
            this.residents = res;
          }
        });
        break;
      case 'rs_resident':
        this.$subscriptions[key] = this.residentSelector$.resident.subscribe(next => {
          this.resident_id = next;
        });
        break;
      default:
        break;
    }
  }

  routeInfo(route_name: string) {
    const resident_id = this.residentSelector$.resident.value;

    return ['/resident', resident_id, {outlets: {'resident-details': [route_name]}}];
  }

  addIfHasPermission(permission: string) {
    return this.auth_$.checkPermission([permission]);
  }

  resident_changed() {
    this.residentSelector$.resident.next(this.resident_id);
    this.router$.navigate(this.routeInfo('responsible-persons'));
  }
}
