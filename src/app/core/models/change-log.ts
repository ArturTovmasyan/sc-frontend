import {User} from './user';
import {Space} from './space';
import {ChangeLogType} from './change-log-type.enum';

export class ChangeLog implements IdInterface {
  id: number;
  type: ChangeLogType;
  owner: User;

  content: any;

  space: Space;
}
