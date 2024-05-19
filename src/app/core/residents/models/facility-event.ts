import {Physician} from './physician';
import {Resident} from './resident';
import {ResponsiblePerson} from './responsible-person';
import {EventDefinition, RepeatType} from './event-definition';
import {User} from '../../models/user';
import {Facility} from './facility';

export class FacilityEvent implements IdInterface {
  id: number;

  definition: EventDefinition;
  notes: string;

  date: Date;

  additional_date: Date;
  responsible_persons: ResponsiblePerson[];
  physician: Physician;

  residents: Resident[];
  users: User[];
  rsvp: boolean;

  all_day: boolean;
  start: Date;
  end: Date;

  no_repeat_end: boolean;
  repeat: RepeatType;
  repeat_end: Date;

  facility: Facility;
}
