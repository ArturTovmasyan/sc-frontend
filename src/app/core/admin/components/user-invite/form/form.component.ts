import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AbstractForm} from '../../../../../shared/components/abstract-form/abstract-form';
import {SpaceService} from '../../../../services/space.service';
import {RoleService} from '../../../services/role.service';
import {Role} from '../../../../models/role';
import {Space} from '../../../../models/space';
import {User} from '../../../../models/user';
import {UserService} from '../../../services/user.service';

@Component({
  templateUrl: 'form.component.html'
})
export class FormComponent extends AbstractForm implements OnInit {
  users: User[];
  roles: Role[];
  spaces: Space[];

  constructor(
    private formBuilder: FormBuilder,
    private user$: UserService,
    private role$: RoleService,
    private space$: SpaceService
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [''],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      owner: [true, Validators.required],
      user_id: [null, Validators.required],
      roles: [[]],
    });

    this.subscribe('list_role');
    this.subscribe('list_user');

    this.add_space();
  }

  private add_space() {
    this.form.addControl('space_id', new FormControl(null, [Validators.required]));
    this.subscribe('list_space');
  }

  protected subscribe(key: string, params?: any): void {
    switch (key) {
      case 'list_space':
        this.$subscriptions[key] = this.space$.all().pipe(first()).subscribe(res => {
          if (res) {
            res.sort((a, b) => a.name.localeCompare(b.name));
            this.spaces = res;
          }
        });
        break;
      case 'list_role':
        this.$subscriptions[key] = this.role$.all(/** TODO: add space filter **/).pipe(first()).subscribe(res => {
          if (res) {
            this.roles = res;
          }
        });
        break;
      case 'list_user':
        this.$subscriptions[key] = this.user$.all(/** TODO: add space filter **/).pipe(first()).subscribe(res => {
          if (res) {
            this.users = res;
          }
        });
        break;
      default:
        break;
    }
  }

}
