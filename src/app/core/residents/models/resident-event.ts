import {Physician} from './physician';
import {Resident} from './resident';
import {ResponsiblePerson} from './responsible-person';
import {EventDefinition} from './event-definition';

export class ResidentEvent implements IdInterface {
  id: number;

  definition: EventDefinition;
  notes: string;

  date: Date;

  additional_date: Date;
  responsible_person: ResponsiblePerson;
  physician: Physician;

  resident: Resident;
}
