import {User} from './user';
import {Space} from './space';
import {Role} from './role';

export class UserInvite {
  id: number;
  email: string;
  token: string;

  space: Space;
  owner: boolean;
  roles: Role[];

  user: User;
}
