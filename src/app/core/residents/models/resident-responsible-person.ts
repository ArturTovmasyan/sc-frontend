import {Resident} from './resident';
import {ResponsiblePerson} from './responsible-person';
import {Relationship} from './relationship';

export class ResidentResponsiblePerson implements IdInterface {
  id: number;

  responsible_person: ResponsiblePerson;
  relationship: Relationship;

  resident: Resident;
}
