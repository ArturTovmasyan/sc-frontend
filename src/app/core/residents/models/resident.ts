import {Salutation} from './salutation';
import {Gender} from './gender.enum';
import {Phone} from '../../models/phone';
import {ResponsiblePerson} from './responsible-person';
import {Physician} from './physician';

export class Resident implements IdInterface {
  id: number;

  salutation: Salutation;

  first_name: string;
  middle_name: string;
  last_name: string;
  birthday: Date;

  photo: string;
  gender: Gender;

  phones: Phone[];

  responsible_persons?: ResponsiblePerson[];
  physicians?: Physician[];

  room_number?: string;
  bed_number?: string;
}
