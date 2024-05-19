import {Diet} from './diet';
import {Resident} from './resident';

export class ResidentDiet implements IdInterface {
  id: number;

  description: string;
  diet: Diet;
  resident: Resident;
}
