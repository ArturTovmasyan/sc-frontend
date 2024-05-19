import {Salutation} from './salutation';
import {Gender} from './gender.enum';
import {Phone} from '../../models/phone';
import {ResponsiblePerson} from './responsible-person';
import {Physician} from './physician';
import {GroupType} from './group-type.enum';

export class Resident implements IdInterface {
  id: number;

  salutation: Salutation;

  first_name: string;
  middle_name: string;
  last_name: string;
  birthday: Date;

  image: string;

  gender: Gender;
  ssn: string;

  phones: Phone[];

  responsible_persons?: ResponsiblePerson[];
  physicians?: Physician[];

  private?: string;
  room_number?: string;
  bed_number?: string;
  group?: string;
  group_type?: GroupType;
}

export enum ResidentState {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  NO_ADMISSION = 'no-admission'
}
