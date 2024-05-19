import {Physician} from './physician';
import {Resident} from './resident';
import {ResponsiblePerson} from './responsible-person';
import {EventDefinition, RepeatType} from './event-definition';
import {User} from '../../models/user';
import {Facility} from './facility';
import {Role} from '../../models/role';

export class CorporateEvent implements IdInterface {
  id: number;

  definition: EventDefinition;
  notes: string;

  residents: Resident[];
  users: User[];
  rsvp: boolean;

  all_day: boolean;
  start_date: Date;
  start_time: Date;
  end_date: Date;
  end_time: Date;

  no_repeat_end: boolean;
  repeat: RepeatType;
  repeat_end: Date;

  user: User;

  facilities: Facility[];
  roles: Role[];
}
