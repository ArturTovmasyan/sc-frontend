import {Resident} from './resident';
import {Physician} from './physician';

export class ResidentPhysician implements IdInterface {
  id: number;

  primary: boolean;
  physician: Physician;
  resident: Resident;
}
