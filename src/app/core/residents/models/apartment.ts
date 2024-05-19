import {CityStateZip} from './city-state-zip';
import {Space} from '../../models/space';

export class Apartment implements IdInterface {
  id: number;

  name: string;
  shorthand: string;
  description: string;
  phone: string;
  fax: string;
  license: string;

  beds_licensed: number;
  beds_target: number;
  beds_configured: number;

  occupation: number;

  address: string;
  csz: CityStateZip;
  space: Space;
}
