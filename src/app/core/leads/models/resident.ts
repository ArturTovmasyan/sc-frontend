import {Salutation} from '../../residents/models/salutation';
import {Gender} from '../../residents/models/gender.enum';

export class Resident implements IdInterface {
  id: number;

  salutation: Salutation;

  first_name: string;
  last_name: string;

  birthday: Date;

  gender: Gender;
  ssn: string;
}
