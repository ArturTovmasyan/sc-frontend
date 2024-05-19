import {Phone} from './phone';

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

  roles: string[];
}
