import {CityStateZip} from './city-state-zip';
import {Space} from '../../models/space';

export class Facility implements IdInterface {
  id: number;

  name: string;
  shorthand: string;
  description: string;
  phone: string;
  fax: string;
  license: string;

  number_of_floors: number;
  license_capacity: number;
  capacity_yellow: number;
  capacity_red: number;

  capacity: number;
  occupation: number;

  address: string;
  csz: CityStateZip;
  space: Space;
}
