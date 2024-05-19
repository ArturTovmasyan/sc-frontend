export class User {
  id: number;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  enabled: boolean;
  completed: boolean;
  last_activity_at: Date;

  roles: string[];
}
