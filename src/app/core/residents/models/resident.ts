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

  image: ResidentImage;
  photo?: string;

  gender: Gender;
  ssn: string;

  phones: Phone[];

  responsible_persons?: ResponsiblePerson[];
  physicians?: Physician[];

  room_number?: string;
  bed_number?: string;
}

export class ResidentImage {
  id: number;

  photo: string;
  photo_35_35: string;
  photo_150_150: string;
  photo_300_300: string;
}
