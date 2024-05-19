import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NzModalService} from 'ng-zorro-antd';
import {TitleService} from '../../../services/title.service';
import {UserService} from '../../services/user.service';
import {GridComponent} from '../../../../shared/components/grid/grid.component';
// import {FormComponent} from './form/form.component';
import {User} from '../../../models/user';

@Component({
  templateUrl: '../../../../shared/components/grid/grid.component.html',
  styleUrls: ['../../../../shared/components/grid/grid.component.scss'],
  providers: [UserService]
})
export class ListComponent extends GridComponent<User, UserService> implements OnInit {
  constructor(service$: UserService, title$: TitleService, modal$: NzModalService, private route$: ActivatedRoute) {
    super(service$, title$, modal$);

    // this.component = FormComponent;

    this.name = 'user-list';
  }

  ngOnInit(): void {
    super.init();
  }
}
