import {ReferrerType} from './referrer-type';
import {CityStateZip} from '../../residents/models/city-state-zip';
import {Phone} from '../../models/phone';

export class Organization implements IdInterface {
  id: number;

  title: string;
  category: ReferrerType;
  address_1: string;
  address_2: string;

  csz: CityStateZip;
  website_url: string;

  phones: Phone[];
  emails: string[];
}
