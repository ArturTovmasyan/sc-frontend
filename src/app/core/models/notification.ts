import {NotificationType} from './notification-type';
import {User} from './user';

export class Notification implements IdInterface {
  id: number;
  type: NotificationType;
  users: User[];
  parameters: any[];
  schedule: string;
}
