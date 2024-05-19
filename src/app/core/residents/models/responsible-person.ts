import {Salutation} from './salutation';
import {Phone} from '../../models/phone';
import {CityStateZip} from './city-state-zip';
import {Space} from '../../models/space';

export class ResponsiblePerson implements IdInterface {
  id: number;

  first_name: string;
  middle_name: string;
  last_name: string;

  address_1: string;
  address_2: string;

  email: string;

  salutation: Salutation;
  csz: CityStateZip;
  space: Space;

  phone: Phone[];
}
