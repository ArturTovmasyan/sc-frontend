import {CityStateZip} from './city-state-zip';
import {Space} from '../../models/space';

export class HospiceProvider implements IdInterface {
  id: number;

  name: string;

  address_1: string;
  address_2: string;

  csz: CityStateZip;

  phone: string;
  email: string;

  space: Space;
}
