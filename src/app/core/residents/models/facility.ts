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
  capacity: string;
  address: string;
  csz: CityStateZip;
  space: Space;
}
