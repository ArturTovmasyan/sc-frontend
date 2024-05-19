import {Space} from '../../models/space';

export class Region implements IdInterface {
  id: number;

  name: string;
  shorthand: string;
  description: string;
  phone: string;
  fax: string;
  space: Space;
}
