import {CityStateZip} from './city-state-zip';
import {Space} from '../../models/space';
import {Salutation} from './salutation';

export class Physician implements IdInterface {
  id: number;

  first_name: string;
  middle_name: string;
  last_name: string;
  address_1: string;
  address_2: string;
  office_phone: string;
  fax: string;
  emergency_phone: string;
  email: string;
  website_url: string;
  salutation: Salutation;
  csz: CityStateZip;
  space: Space;
}
