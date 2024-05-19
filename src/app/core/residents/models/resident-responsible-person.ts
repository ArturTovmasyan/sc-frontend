import {Resident} from './resident';
import {ResponsiblePerson} from './responsible-person';
import {Relationship} from './relationship';
import {ResponsiblePersonRole} from './responsible-person-role';

export class ResidentResponsiblePerson implements IdInterface {
  id: number;

  responsible_person: ResponsiblePerson;
  relationship: Relationship;
  role: ResponsiblePersonRole;

  resident: Resident;
}
