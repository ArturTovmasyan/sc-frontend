import {Phone} from './phone';
import {Space} from './space';

export class User {
  id: number;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  email: string;
  enabled: boolean;
  completed: boolean;
  last_activity_at: Date;

  avatar: string;
  phones: Phone[];

  permissions: string[];

  space: Space;
}
