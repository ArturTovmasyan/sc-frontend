import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {ResidentSelectorService} from '../../services/resident-selector.service';
import {FormBuilder} from '@angular/forms';
import {AuthGuard} from '../../../guards/auth.guard';

@Component({
  selector: 'app-resident-selector',
  templateUrl: './resident-selector.component.html',
  styleUrls: ['./resident-selector.component.scss']
})
export class ResidentSelectorComponent {
  constructor(
    private formBuilder: FormBuilder,
    private router$: Router,
    private auth_$: AuthGuard,
    public residentSelector$: ResidentSelectorService
  ) {
  }

  routeInfo(route_name: string) {
    const resident_id = this.residentSelector$.resident.value;

    return ['/resident', resident_id, {outlets: {'resident-details': [route_name]}}];
  }

  addIfHasPermission(permission: string) {
    return this.auth_$.checkPermission([permission]);
  }
}
