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

  image: UserImage;
  phones: Phone[];

  permissions: string[];

  space: Space;

  owner: boolean;
  license_accepted: boolean;
}

export class UserImage {
  id: number;

  photo: string;
  photo_35_35: string;
  photo_150_150: string;
  photo_300_300: string;
}
